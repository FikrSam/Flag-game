import React, { useState, useRef, useCallback } from 'react';
import { EUROPE_COUNTRIES, CONTEXT_LAND_PATHS, MAP_CONFIG } from '../data/europeData';
import type { CountryData } from '../types/game';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

export interface InteractiveMapProps {
  countries?: CountryData[];
  contextLandPaths?: string[];
  mapConfig?: { viewBox: string; width: number; height: number };
  placedCountries: Set<string>;
  selectedFlagId: string | null;
  highlightedCountryId: string | null;
  onCountryMatch: (countryId: string) => void;
  continentName?: string;
}

const MIN_ZOOM = 0.8;
const MAX_ZOOM = 4.5;

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  countries = EUROPE_COUNTRIES,
  contextLandPaths = CONTEXT_LAND_PATHS,
  mapConfig = MAP_CONFIG,
  placedCountries,
  selectedFlagId,
  highlightedCountryId,
  onCountryMatch
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPointerDown, setIsPointerDown] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [pointerDownPos, setPointerDownPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredCountryId, setHoveredCountryId] = useState<string | null>(null);
  const [dragOverCountryId, setDragOverCountryId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Smart pan boundaries: expanded 20-25% for extra open canvas freedom
  const clampPan = useCallback((x: number, y: number, currentZoom: number) => {
    const baseMarginX = 205;
    const baseMarginY = 175;
    const maxOffsetX = (Math.max(currentZoom, 1.0) - 1) * 650 + baseMarginX;
    const maxOffsetY = (Math.max(currentZoom, 1.0) - 1) * 525 + baseMarginY;

    return {
      x: Math.min(Math.max(x, -maxOffsetX), maxOffsetX),
      y: Math.min(Math.max(y, -maxOffsetY), maxOffsetY)
    };
  }, []);

  const updateZoom = useCallback((newZoom: number) => {
    const clampedZoom = Math.min(Math.max(newZoom, MIN_ZOOM), MAX_ZOOM);
    setZoom(clampedZoom);
    setPan(prev => clampPan(prev.x, prev.y, clampedZoom));
  }, [clampPan]);

  // Smooth zoom handlers
  const handleZoomIn = () => updateZoom(zoom * 1.15);
  const handleZoomOut = () => updateZoom(zoom / 1.15);
  const handleResetZoom = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  };

  // Granular wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.04 : 0.96;
    updateZoom(zoom * zoomFactor);
  };

  // Mouse pan handlers with smart bounded panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsPointerDown(true);
      setIsDragging(false);
      setPointerDownPos({ x: e.clientX, y: e.clientY });
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPointerDown) {
      const dx = e.clientX - pointerDownPos.x;
      const dy = e.clientY - pointerDownPos.y;
      if (!isDragging && Math.hypot(dx, dy) > 4) {
        setIsDragging(true);
      }
      if (isDragging || Math.hypot(dx, dy) > 4) {
        const rawX = e.clientX - dragStart.x;
        const rawY = e.clientY - dragStart.y;
        setPan(clampPan(rawX, rawY, zoom));
      }
    }
  };

  const handleMouseUp = () => {
    setIsPointerDown(false);
    setTimeout(() => setIsDragging(false), 50);
  };

  // Multi-touch tracking (pinch-to-zoom & 1-finger pan)
  const touchStateRef = useRef<{
    initialDist: number;
    initialZoom: number;
    touchStartTime: number;
    touchStartPos: { x: number; y: number };
    isPinching: boolean;
  }>({
    initialDist: 0,
    initialZoom: 1,
    touchStartTime: 0,
    touchStartPos: { x: 0, y: 0 },
    isPinching: false
  });

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const t = e.touches[0];
      setIsPointerDown(true);
      setIsDragging(false);
      setPointerDownPos({ x: t.clientX, y: t.clientY });
      setDragStart({ x: t.clientX - pan.x, y: t.clientY - pan.y });
      touchStateRef.current.touchStartTime = e.timeStamp;
      touchStateRef.current.touchStartPos = { x: t.clientX, y: t.clientY };
      touchStateRef.current.isPinching = false;
    } else if (e.touches.length === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      touchStateRef.current.initialDist = dist;
      touchStateRef.current.initialZoom = zoom;
      touchStateRef.current.isPinching = true;
      setIsDragging(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && !touchStateRef.current.isPinching) {
      const t = e.touches[0];
      const dx = t.clientX - touchStateRef.current.touchStartPos.x;
      const dy = t.clientY - touchStateRef.current.touchStartPos.y;
      if (!isDragging && Math.hypot(dx, dy) > 5) {
        setIsDragging(true);
      }
      if (isDragging || Math.hypot(dx, dy) > 5) {
        const rawX = t.clientX - dragStart.x;
        const rawY = t.clientY - dragStart.y;
        setPan(clampPan(rawX, rawY, zoom));
      }
    } else if (e.touches.length === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      if (touchStateRef.current.initialDist > 0) {
        const scaleFactor = dist / touchStateRef.current.initialDist;
        const newZoom = touchStateRef.current.initialZoom * scaleFactor;
        updateZoom(newZoom);
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length === 0) {
      setIsPointerDown(false);
      setTimeout(() => setIsDragging(false), 50);
      touchStateRef.current.isPinching = false;
    } else if (e.touches.length === 1) {
      const t = e.touches[0];
      setDragStart({ x: t.clientX - pan.x, y: t.clientY - pan.y });
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
  const handleCountryClick = (countryId: string) => {
    if (!isDragging && selectedFlagId) {
      onCountryMatch(countryId);
    }
  };

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent, countryId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCountryClick(countryId);
    }
  };

  // Microstate countries list (marked with rings & target dots for easy targeting)
  const microstateCountries = countries.filter(c => c.isMicrostate || ['MT', 'CY', 'LU', 'CV', 'ST', 'SC', 'MU', 'KM', 'SZ', 'LS', 'DJ', 'GM', 'RW', 'BI', 'GQ', 'SL'].includes(c.id));

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[280px] bg-[#0f182a] rounded-lg shadow-md overflow-hidden flex items-center justify-center select-none touch-none"
      onWheel={handleWheel}
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
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1 bg-[#131f33]/90 backdrop-blur-md p-1 rounded-md border border-slate-700/60 shadow-sm">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded transition-colors active:scale-95"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded transition-colors active:scale-95"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetZoom}
          title="Reset Zoom"
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded transition-colors active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* SVG Canvas */}
      <svg
        ref={svgRef}
        viewBox={mapConfig.viewBox}
        className="w-full h-full max-h-full transition-transform duration-75 ease-out"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '50% 50%'
        }}
      >
        <defs>
          {/* SVG Patterns for filled country flags (centered on country centroid with EXACT 4:3 aspect ratio, 0% distortion) */}
          {countries.map((country) => {
            const [cx, cy] = country.centroid;
            const halfW = Math.max(cx - country.bbox.x, (country.bbox.x + country.bbox.width) - cx);
            const halfH = Math.max(cy - country.bbox.y, (country.bbox.y + country.bbox.height) - cy);
            const minW = Math.max(1, halfW * 2);
            const minH = Math.max(1, halfH * 2);

            const FLAG_ASPECT_RATIO = 4 / 3;
            let patW: number;
            let patH: number;

            // Preserve natural 4:3 flag aspect ratio without any stretching or squishing
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
          })}
        </defs>

        {/* Ocean Background (Exact solid dark navy #0f182a) */}
        <rect width={mapConfig.width} height={mapConfig.height} fill="#0f182a" className="map-ocean" />

        {/* Surrounding Context Landmasses (Exact #1e2b45) */}
        {/* Surrounding Context Landmasses (Subtle background land) */}
        <g className="context-land" fill="#1a253b" stroke="#334460" strokeWidth="0.4">
          {contextLandPaths.map((pathD, idx) => (
            <path key={`ctx-${idx}`} d={pathD} className="context-land" />
          ))}
        </g>

        {/* Country Polygons (Slate blue #2a3d5e with crisp lighter #6b82a6 borders) */}
        <g id="country-polygons">
          {countries.map((country) => {
            const isPlaced = placedCountries.has(country.id);
            const isHovered = hoveredCountryId === country.id;
            const isDragOver = dragOverCountryId === country.id;
            const isHighlighted = highlightedCountryId === country.id;

            let fill = '#2a3d5e';
            let stroke = '#6b82a6';
            let strokeWidth = 0.5;

            if (isPlaced) {
              fill = `url(#flag-pat-${country.id})`;
              stroke = '#22c55e';
              strokeWidth = 0.6;
            } else if (isDragOver) {
              fill = '#b45309';
              stroke = '#f59e0b';
            } else if (isHighlighted) {
              fill = '#78350f';
              stroke = '#facc15';
            } else if (isHovered) {
              fill = '#364f78';
              stroke = '#93c5fd';
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
                className="cursor-pointer focus:outline-none transition-colors duration-100"
                onMouseEnter={() => setHoveredCountryId(country.id)}
                onMouseLeave={() => setHoveredCountryId(null)}
                onClick={() => handleCountryClick(country.id)}
                onKeyDown={(e) => handleKeyDown(e, country.id)}
                onDragOver={(e) => handleDragOver(e, country.id)}
                onDragLeave={(e) => handleDragLeave(e, country.id)}
                onDrop={(e) => handleDrop(e, country.id)}
              />
            );
          })}
        </g>

        {/* Placed Country Name Labels */}
        <g id="country-labels" className="pointer-events-none">
          {countries.filter(c => placedCountries.has(c.id)).map((country) => {
            const [cx, cy] = country.centroid;
            if (country.isMicrostate) return null;

            return (
              <text
                key={`label-${country.id}`}
                x={cx}
                y={cy + 2.5}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="7"
                fontWeight="700"
                className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)] select-none"
              >
                {country.name}
              </text>
            );
          })}
        </g>

        {/* Microstates: When unplaced, shows subtle ring & dot. When placed, renders a small flag rectangle with green border */}
        <g id="microstate-markers">
          {microstateCountries.map((country) => {
            const isPlaced = placedCountries.has(country.id);
            const isHovered = hoveredCountryId === country.id;
            const isDragOver = dragOverCountryId === country.id;
            const isHighlighted = highlightedCountryId === country.id;
            const [cx, cy] = country.centroid;

            // When placed, always display crisp non-repeating flag rectangle
            if (isPlaced) {
              const rectW = 15;
              const rectH = 11;
              return (
                <g
                  key={`micro-flag-${country.id}`}
                  className="cursor-pointer group"
                  onClick={() => handleCountryClick(country.id)}
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
                  />
                  <rect
                    x={cx - rectW / 2}
                    y={cy - rectH / 2}
                    width={rectW}
                    height={rectH}
                    rx={1}
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth={0.9}
                    className="pointer-events-none"
                  />
                </g>
              );
            }

            // When unplaced, always show target ring (visible across all zoom levels)
            return (
              <g
                key={`ring-${country.id}`}
                className="cursor-pointer"
                tabIndex={0}
                role="button"
                aria-label="Small country target ring"
                onClick={() => handleCountryClick(country.id)}
                onKeyDown={(e) => handleKeyDown(e, country.id)}
                onDragOver={(e) => handleDragOver(e, country.id)}
                onDragLeave={(e) => handleDragLeave(e, country.id)}
                onDrop={(e) => handleDrop(e, country.id)}
                onMouseEnter={() => setHoveredCountryId(country.id)}
                onMouseLeave={() => setHoveredCountryId(null)}
              >
                {/* Outer Target Ring */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={6.5}
                  fill={isDragOver ? '#f59e0b' : isHighlighted ? '#eab308' : isHovered ? '#364f78' : 'rgba(42, 61, 94, 0.6)'}
                  stroke={isHighlighted ? '#facc15' : isHovered ? '#93c5fd' : '#7e9cc2'}
                  strokeWidth={0.8}
                  className="transition-all duration-150"
                />

                {/* Inner Dot */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={1.8}
                  fill="#e2e8f0"
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
              <circle cx={0} cy={0} r={14} fill="none" stroke="#facc15" strokeWidth={1.5} />
              <circle cx={0} cy={0} r={4} fill="#facc15" />
            </g>
          );
        })()}
      </svg>
    </div>
  );
};

// Backward-compatible alias
export const EuropeMap = InteractiveMap;
