import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import type { CountryData } from '../types/game';
import { IconZoomIn, IconZoomOut, IconRotateClockwise } from './TablerIcons';

export interface InteractiveMapProps {
  countries: CountryData[];
  contextLandPaths?: string[];
  mapConfig: { viewBox: string; width: number; height: number };
  placedCountries: Set<string>;
  selectedFlagId: string | null;
  highlightedCountryId: string | null;
  onCountryMatch: (countryId: string) => void;
  continentName?: string;
}

const MIN_ZOOM = 0.8;
const MAX_ZOOM = 4.5;

const DEFAULT_MAP_CONFIG = { viewBox: "0 0 1000 800", width: 1000, height: 800 };

// Comprehensive microstate, small territory, and island nation detection
const MICROSTATE_AND_ISLAND_COUNTRY_IDS = new Set([
  // Europe
  'VA', 'MC', 'SM', 'AD', 'LI', 'MT', 'LU', 'CY',
  // Africa
  'CV', 'ST', 'SC', 'MU', 'KM', 'SZ', 'LS', 'DJ', 'GM', 'RW', 'BI', 'GQ', 'SL', 'GW', 'TG',
  // Asia
  'BH', 'SG', 'MV', 'BN', 'QA', 'KW', 'LB', 'PS', 'IL', 'CY', 'TL', 'BT', 'AM', 'TW',
  // North America (Caribbean & Central America)
  'KN', 'AG', 'DM', 'LC', 'VC', 'GD', 'BB', 'TT', 'JM', 'HT', 'DO', 'BZ', 'SV',
  // Oceania (All Pacific Island Nations)
  'NR', 'TV', 'PW', 'MH', 'FM', 'TO', 'WS', 'KI', 'VU', 'FJ', 'SB'
]);

function isCountryBeacon(c: CountryData): boolean {
  if (c.isMicrostate) return true;
  if (MICROSTATE_AND_ISLAND_COUNTRY_IDS.has(c.id)) return true;
  const maxDim = Math.max(c.bbox.width, c.bbox.height);
  const area = c.bbox.width * c.bbox.height;
  return maxDim < 26 || area < 400;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  countries,
  contextLandPaths = [],
  mapConfig = DEFAULT_MAP_CONFIG,
  placedCountries,
  selectedFlagId,
  highlightedCountryId,
  onCountryMatch
}) => {
  // Combined transform state ensures pan and zoom update atomically in a single render pass
  const [transform, setTransform] = useState<{ zoom: number; pan: { x: number; y: number } }>({
    zoom: 1,
    pan: { x: 0, y: 0 }
  });

  const { zoom, pan } = transform;

  const [isPointerDown, setIsPointerDown] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [pointerDownPos, setPointerDownPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredCountryId, setHoveredCountryId] = useState<string | null>(null);
  const [dragOverCountryId, setDragOverCountryId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragStartRef = useRef<{ clientX: number; clientY: number; panX: number; panY: number } | null>(null);

  // Soft boundary clamping in SVG coordinate units
  const clampPan = useCallback((x: number, y: number, currentZoom: number) => {
    const margin = 200;
    const minX = mapConfig.width * (1 - currentZoom) - margin;
    const maxX = margin;
    const minY = mapConfig.height * (1 - currentZoom) - margin;
    const maxY = margin;

    return {
      x: Math.min(Math.max(x, minX), maxX),
      y: Math.min(Math.max(y, minY), maxY)
    };
  }, [mapConfig.width, mapConfig.height]);

  // Convert client viewport coordinates (clientX, clientY) to SVG viewBox space (0..1000, 0..800)
  const getSvgCoordinates = useCallback((clientX: number, clientY: number): { x: number; y: number } => {
    if (!svgRef.current) return { x: mapConfig.width / 2, y: mapConfig.height / 2 };
    const rect = svgRef.current.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return { x: mapConfig.width / 2, y: mapConfig.height / 2 };

    const svgAspect = mapConfig.width / mapConfig.height;
    const domAspect = rect.width / rect.height;

    let scale: number;
    let offsetX = 0;
    let offsetY = 0;

    if (domAspect > svgAspect) {
      scale = rect.height / mapConfig.height;
      offsetX = (rect.width - mapConfig.width * scale) / 2;
    } else {
      scale = rect.width / mapConfig.width;
      offsetY = (rect.height - mapConfig.height * scale) / 2;
    }

    return {
      x: (clientX - rect.left - offsetX) / scale,
      y: (clientY - rect.top - offsetY) / scale
    };
  }, [mapConfig.width, mapConfig.height]);

  // Ratio of screen pixels to SVG coordinate units
  const getScreenScale = useCallback((): number => {
    if (!svgRef.current) return 1;
    const rect = svgRef.current.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return 1;
    return Math.min(rect.width / mapConfig.width, rect.height / mapConfig.height);
  }, [mapConfig.width, mapConfig.height]);

  // Zoom anchored directly to a specific point (e.g. mouse cursor or center of map)
  const zoomToPoint = useCallback((anchorX: number, anchorY: number, newZoom: number) => {
    setTransform(prev => {
      const clampedZoom = Math.min(Math.max(newZoom, MIN_ZOOM), MAX_ZOOM);
      if (Math.abs(clampedZoom - prev.zoom) < 0.0001) return prev;

      // Invariant: The content coordinate under (anchorX, anchorY) remains stationary
      const contentX = (anchorX - prev.pan.x) / prev.zoom;
      const contentY = (anchorY - prev.pan.y) / prev.zoom;

      const newPanX = anchorX - contentX * clampedZoom;
      const newPanY = anchorY - contentY * clampedZoom;

      return {
        zoom: clampedZoom,
        pan: clampPan(newPanX, newPanY, clampedZoom)
      };
    });
  }, [clampPan]);

  // Corner control button handlers (zoom to canvas center)
  const handleZoomIn = () => {
    zoomToPoint(mapConfig.width / 2, mapConfig.height / 2, zoom * 1.25);
  };

  const handleZoomOut = () => {
    zoomToPoint(mapConfig.width / 2, mapConfig.height / 2, zoom / 1.25);
  };

  const handleResetZoom = () => {
    setTransform({ zoom: 1.0, pan: { x: 0, y: 0 } });
  };

  // Natural cursor-anchored wheel & trackpad zoom with continuous exponential scaling
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();

    const anchor = getSvgCoordinates(e.clientX, e.clientY);

    let delta = e.deltaY;
    if (e.deltaMode === 1) delta *= 24; // lines to pixels

    // e.ctrlKey indicates native trackpad pinch on macOS Safari & Chrome
    const sensitivity = e.ctrlKey ? 0.01 : 0.0018;
    const factor = Math.exp(-delta * sensitivity);

    setTransform(prev => {
      const newZoom = Math.min(Math.max(prev.zoom * factor, MIN_ZOOM), MAX_ZOOM);
      if (Math.abs(newZoom - prev.zoom) < 0.0001) return prev;

      const contentX = (anchor.x - prev.pan.x) / prev.zoom;
      const contentY = (anchor.y - prev.pan.y) / prev.zoom;

      const newPanX = anchor.x - contentX * newZoom;
      const newPanY = anchor.y - contentY * newZoom;

      return {
        zoom: newZoom,
        pan: clampPan(newPanX, newPanY, newZoom)
      };
    });
  }, [getSvgCoordinates, clampPan]);

  // Attach non-passive wheel listener to allow reliable e.preventDefault()
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  // Mouse pan handlers: 1:1 tracking in SVG space
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsPointerDown(true);
      setIsDragging(false);
      setPointerDownPos({ x: e.clientX, y: e.clientY });
      dragStartRef.current = {
        clientX: e.clientX,
        clientY: e.clientY,
        panX: pan.x,
        panY: pan.y
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPointerDown && dragStartRef.current) {
      const dx = e.clientX - pointerDownPos.x;
      const dy = e.clientY - pointerDownPos.y;
      if (!isDragging && Math.hypot(dx, dy) > 4) {
        setIsDragging(true);
      }
      if (isDragging || Math.hypot(dx, dy) > 4) {
        const screenScale = getScreenScale();
        const deltaSvgX = (e.clientX - dragStartRef.current.clientX) / screenScale;
        const deltaSvgY = (e.clientY - dragStartRef.current.clientY) / screenScale;

        setTransform(prev => ({
          ...prev,
          pan: clampPan(
            dragStartRef.current!.panX + deltaSvgX,
            dragStartRef.current!.panY + deltaSvgY,
            prev.zoom
          )
        }));
      }
    }
  };

  const handleMouseUp = () => {
    setIsPointerDown(false);
    dragStartRef.current = null;
    setTimeout(() => setIsDragging(false), 50);
  };

  // Multi-touch tracking: 1-finger pan & 2-finger pinch centered on pinch midpoint
  const touchStateRef = useRef<{
    initialDist: number;
    initialZoom: number;
    initialPan: { x: number; y: number };
    anchorSvg: { x: number; y: number };
    isPinching: boolean;
  }>({
    initialDist: 0,
    initialZoom: 1,
    initialPan: { x: 0, y: 0 },
    anchorSvg: { x: 0, y: 0 },
    isPinching: false
  });

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const t = e.touches[0];
      setIsPointerDown(true);
      setIsDragging(false);
      setPointerDownPos({ x: t.clientX, y: t.clientY });
      dragStartRef.current = {
        clientX: t.clientX,
        clientY: t.clientY,
        panX: pan.x,
        panY: pan.y
      };
      touchStateRef.current.isPinching = false;
    } else if (e.touches.length === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      const midClientX = (t1.clientX + t2.clientX) / 2;
      const midClientY = (t1.clientY + t2.clientY) / 2;

      touchStateRef.current = {
        initialDist: Math.max(dist, 1),
        initialZoom: zoom,
        initialPan: { ...pan },
        anchorSvg: getSvgCoordinates(midClientX, midClientY),
        isPinching: true
      };
      setIsDragging(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && !touchStateRef.current.isPinching && dragStartRef.current) {
      const t = e.touches[0];
      const dx = t.clientX - pointerDownPos.x;
      const dy = t.clientY - pointerDownPos.y;
      if (!isDragging && Math.hypot(dx, dy) > 5) {
        setIsDragging(true);
      }
      if (isDragging || Math.hypot(dx, dy) > 5) {
        const screenScale = getScreenScale();
        const deltaSvgX = (t.clientX - dragStartRef.current.clientX) / screenScale;
        const deltaSvgY = (t.clientY - dragStartRef.current.clientY) / screenScale;

        setTransform(prev => ({
          ...prev,
          pan: clampPan(
            dragStartRef.current!.panX + deltaSvgX,
            dragStartRef.current!.panY + deltaSvgY,
            prev.zoom
          )
        }));
      }
    } else if (e.touches.length === 2 && touchStateRef.current.isPinching) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);

      if (touchStateRef.current.initialDist > 0) {
        const scaleFactor = dist / touchStateRef.current.initialDist;
        const targetZoom = Math.min(Math.max(touchStateRef.current.initialZoom * scaleFactor, MIN_ZOOM), MAX_ZOOM);

        const { anchorSvg, initialPan, initialZoom } = touchStateRef.current;
        const contentX = (anchorSvg.x - initialPan.x) / initialZoom;
        const contentY = (anchorSvg.y - initialPan.y) / initialZoom;

        const newPanX = anchorSvg.x - contentX * targetZoom;
        const newPanY = anchorSvg.y - contentY * targetZoom;

        setTransform({
          zoom: targetZoom,
          pan: clampPan(newPanX, newPanY, targetZoom)
        });
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length === 0) {
      setIsPointerDown(false);
      dragStartRef.current = null;
      setTimeout(() => setIsDragging(false), 50);
      touchStateRef.current.isPinching = false;
    } else if (e.touches.length === 1) {
      const t = e.touches[0];
      dragStartRef.current = {
        clientX: t.clientX,
        clientY: t.clientY,
        panX: pan.x,
        panY: pan.y
      };
      setPointerDownPos({ x: t.clientX, y: t.clientY });
      touchStateRef.current.isPinching = false;
    }
  };

  // Drag & Drop handlers from dock
  const handleDragOver = (e: React.DragEvent, countryId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (dragOverCountryId !== countryId) {
      setDragOverCountryId(countryId);
    }
  };

  const handleDragLeave = (e: React.DragEvent, countryId: string) => {
    e.preventDefault();
    if (dragOverCountryId === countryId) {
      setDragOverCountryId(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetCountryId: string) => {
    e.preventDefault();
    setDragOverCountryId(null);
    const droppedFlagId = e.dataTransfer.getData('text/plain') || selectedFlagId;
    if (droppedFlagId) {
      onCountryMatch(targetCountryId);
    }
  };

  // Click handler (only triggered if not dragging/panning)
  const handleCountryClick = (e: React.MouseEvent | React.TouchEvent | React.KeyboardEvent, countryId: string) => {
    e.stopPropagation();
    if (!isDragging && selectedFlagId) {
      onCountryMatch(countryId);
    }
  };

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent, countryId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCountryClick(e, countryId);
    }
  };

  // Microstate countries list
  const microstateCountries = useMemo(() => countries.filter(isCountryBeacon), [countries]);

  // Memoized SVG Pattern Definitions (avoid recreating 50+ patterns on every zoom/pan tick)
  const flagPatterns = useMemo(() => {
    const FLAG_ASPECT_RATIO = 4 / 3;
    return countries.map((country) => {
      const [cx, cy] = country.centroid;
      const halfW = Math.max(cx - country.bbox.x, (country.bbox.x + country.bbox.width) - cx);
      const halfH = Math.max(cy - country.bbox.y, (country.bbox.y + country.bbox.height) - cy);
      const minW = Math.max(1, halfW * 2);
      const minH = Math.max(1, halfH * 2);

      let patW: number;
      let patH: number;

      if (minW / minH > FLAG_ASPECT_RATIO) {
        patW = minW;
        patH = minW / FLAG_ASPECT_RATIO;
      } else {
        patH = minH;
        patW = minH * FLAG_ASPECT_RATIO;
      }

      const patX = Math.round(cx - patW / 2);
      const patY = Math.round(cy - patH / 2);
      const roundedW = Math.round(patW);
      const roundedH = Math.round(patH);

      return (
        <pattern
          key={`flag-pattern-${country.id}`}
          id={`flag-pat-${country.id}`}
          patternUnits="userSpaceOnUse"
          x={patX}
          y={patY}
          width={roundedW}
          height={roundedH}
        >
          <image
            href={country.flagDataUri}
            xlinkHref={country.flagDataUri}
            x={0}
            y={0}
            width={roundedW}
            height={roundedH}
            preserveAspectRatio="xMidYMid slice"
          />
        </pattern>
      );
    });
  }, [countries]);

  // Memoized Context Land
  const contextLand = useMemo(() => {
    return contextLandPaths.map((pathD, idx) => (
      <path key={`ctx-${idx}`} d={pathD} className="context-land" />
    ));
  }, [contextLandPaths]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[280px] bg-[#0a0a0a] rounded-lg overflow-hidden flex items-center justify-center select-none touch-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ cursor: isDragging ? 'grabbing' : 'default' }}
      role="region"
      aria-label="Continent Map"
    >
      {/* Zoom controls */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-0.5 bg-[#141414]/90 backdrop-blur-md p-1 rounded-lg border border-[#222222] shadow-lg">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="p-1.5 text-[#555555] hover:text-[#e5e7eb] hover:bg-[#1e1e1e] rounded-md transition-colors duration-150 active:scale-95"
        >
          <IconZoomIn size={15} strokeWidth={2} />
        </button>
        <div className="h-px bg-[#1e1e1e] mx-1" />
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="p-1.5 text-[#555555] hover:text-[#e5e7eb] hover:bg-[#1e1e1e] rounded-md transition-colors duration-150 active:scale-95"
        >
          <IconZoomOut size={15} strokeWidth={2} />
        </button>
        <div className="h-px bg-[#1e1e1e] mx-1" />
        <button
          onClick={handleResetZoom}
          title="Reset Zoom"
          className="p-1.5 text-[#555555] hover:text-[#e5e7eb] hover:bg-[#1e1e1e] rounded-md transition-colors duration-150 active:scale-95"
        >
          <IconRotateClockwise size={15} strokeWidth={2} />
        </button>
      </div>

      {/* Static SVG Viewport: No CSS transform on SVG eliminates GPU tile ghosting/afterimages */}
      <svg
        ref={svgRef}
        viewBox={mapConfig.viewBox}
        className="w-full h-full max-h-full block"
      >
        <defs>
          {flagPatterns}
        </defs>

        {/* Global ocean fill */}
        <rect width={mapConfig.width} height={mapConfig.height} fill="#0a0a0a" className="map-ocean" />

        {/* Pure SVG Vector Stage: Native coordinate transformation without browser rasterization artifacts */}
        <g
          id="map-stage"
          transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
        >
          {/* Stage ocean plane */}
          <rect width={mapConfig.width} height={mapConfig.height} fill="#0a0a0a" />

          {/* Surrounding Context Landmasses */}
          <g className="context-land" fill="#151515" stroke="#1e1e1e" strokeWidth="0.4">
            {contextLand}
          </g>

          {/* Country Polygons */}
          <g id="country-polygons">
            {countries.map((country) => {
              const isPlaced = placedCountries.has(country.id);
              const isHovered = hoveredCountryId === country.id;
              const isDragOver = dragOverCountryId === country.id;
              const isHighlighted = highlightedCountryId === country.id;

              let fill = '#1e1e1e';
              let stroke = '#3a3a3a';
              let strokeWidth = 0.5;

              if (isPlaced) {
                fill = `url(#flag-pat-${country.id})`;
                stroke = '#22c55e';
                strokeWidth = 0.7;
              } else if (isDragOver || isHighlighted) {
                fill = '#3a3a3a';
                stroke = '#555555';
              } else if (isHovered) {
                fill = '#2a2a2a';
                stroke = '#4a4a4a';
              }

              return (
                <path
                  key={country.id}
                  id={`country-${country.id}`}
                  d={country.path}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  tabIndex={0}
                  role="button"
                  aria-label={isPlaced ? `${country.name}, placed` : 'Country location'}
                  className="cursor-pointer focus:outline-none"
                  onMouseEnter={() => setHoveredCountryId(country.id)}
                  onMouseLeave={() => setHoveredCountryId(null)}
                  onClick={(e) => handleCountryClick(e, country.id)}
                  onKeyDown={(e) => handleKeyDown(e, country.id)}
                  onDragOver={(e) => handleDragOver(e, country.id)}
                  onDragLeave={(e) => handleDragLeave(e, country.id)}
                  onDrop={(e) => handleDrop(e, country.id)}
                />
              );
            })}
          </g>

          {/* Microstates & Island Nations */}
          <g id="microstate-markers">
            {microstateCountries.map((country) => {
              const isPlaced = placedCountries.has(country.id);
              const isHovered = hoveredCountryId === country.id;
              const isDragOver = dragOverCountryId === country.id;
              const isHighlighted = highlightedCountryId === country.id;
              const [cx, cy] = country.centroid;

              if (isPlaced) {
                const rectW = 16;
                const rectH = 11;
                return (
                  <g
                    key={`micro-flag-${country.id}`}
                    id={`country-${country.id}-placed-beacon`}
                    data-beacon-country={country.id}
                    className="cursor-pointer group"
                    onClick={(e) => handleCountryClick(e, country.id)}
                    tabIndex={0}
                    role="button"
                    aria-label={`${country.name}, placed flag`}
                  >
                    <image
                      href={country.flagDataUri}
                      xlinkHref={country.flagDataUri}
                      x={cx - rectW / 2}
                      y={cy - rectH / 2}
                      width={rectW}
                      height={rectH}
                      preserveAspectRatio="none"
                      data-beacon-country={country.id}
                    />
                    <rect
                      x={cx - rectW / 2}
                      y={cy - rectH / 2}
                      width={rectW}
                      height={rectH}
                      rx={1.5}
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth={1}
                      className="pointer-events-none"
                    />
                  </g>
                );
              }

              const isInteractive = isHovered || isDragOver || isHighlighted;
              return (
                <g
                  key={`ring-${country.id}`}
                  id={`country-${country.id}-beacon`}
                  data-beacon-country={country.id}
                  className="cursor-pointer"
                  tabIndex={0}
                  role="button"
                  aria-label={`${country.name} target beacon`}
                  onClick={(e) => handleCountryClick(e, country.id)}
                  onKeyDown={(e) => handleKeyDown(e, country.id)}
                  onDragOver={(e) => handleDragOver(e, country.id)}
                  onDragLeave={(e) => handleDragLeave(e, country.id)}
                  onDrop={(e) => handleDrop(e, country.id)}
                  onMouseEnter={() => setHoveredCountryId(country.id)}
                  onMouseLeave={() => setHoveredCountryId(null)}
                >
                  <circle
                    cx={cx}
                    cy={cy}
                    r={14}
                    fill="transparent"
                    data-beacon-country={country.id}
                  />

                  {(isHighlighted || isDragOver) && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={12}
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth={1.2}
                      className="animate-ping opacity-75 pointer-events-none"
                    />
                  )}

                  <circle
                    cx={cx}
                    cy={cy}
                    r={isInteractive ? 7.5 : 6}
                    fill={isDragOver || isHighlighted ? '#3a3a3a' : isHovered ? '#2a2a2a' : 'rgba(18, 18, 18, 0.95)'}
                    stroke={isDragOver || isHighlighted ? '#22c55e' : isHovered ? '#e5e7eb' : '#777777'}
                    strokeWidth={isInteractive ? 1.4 : 0.8}
                    className="transition-all duration-150"
                    data-beacon-country={country.id}
                  />

                  <circle
                    cx={cx}
                    cy={cy}
                    r={2}
                    fill={isDragOver || isHighlighted ? '#22c55e' : '#e5e7eb'}
                    className="pointer-events-none"
                  />
                </g>
              );
            })}
          </g>

          {/* Highlighted Beacon */}
          {highlightedCountryId && (() => {
            const target = countries.find(c => c.id === highlightedCountryId);
            if (!target) return null;
            const [cx, cy] = target.centroid;
            return (
              <g transform={`translate(${cx}, ${cy})`} className="pointer-events-none animate-pulse">
                <circle cx={0} cy={0} r={14} fill="none" stroke="#e5e7eb" strokeWidth={1.5} />
                <circle cx={0} cy={0} r={4} fill="#e5e7eb" />
              </g>
            );
          })()}
        </g>
      </svg>
    </div>
  );
};
