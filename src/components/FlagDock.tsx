import React, { useRef, useEffect, useState } from 'react';
import type { CountryData } from '../types/game';
import { FlagImage } from './FlagImage';
import { IconHelp, IconEye, IconCheck } from './TablerIcons';

export interface FlagDockProps {
  unplacedCountries: CountryData[];
  selectedFlagId: string | null;
  namedCountryIds: Set<string>;
  onSelectFlag: (countryId: string) => void;
  onNameIt: (countryId: string) => void;
  onShowMe: (countryId: string) => void;
  onDropOnCountry?: (countryId: string) => void;
}

export const FlagDock: React.FC<FlagDockProps> = ({
  unplacedCountries,
  selectedFlagId,
  namedCountryIds,
  onSelectFlag,
  onNameIt,
  onShowMe,
  onDropOnCountry
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number; countryId: string; time: number } | null>(null);

  // Touch drag state (when dragging vertically upwards onto the map canvas)
  const [touchDrag, setTouchDrag] = useState<{
    countryId: string;
    currentX: number;
    currentY: number;
    isDragging: boolean;
  } | null>(null);

  // Find currently active country from selectedFlagId
  const selectedCountry = unplacedCountries.find(c => c.id === selectedFlagId) || unplacedCountries[0];
  const isCurrentFlagNamed = selectedCountry ? namedCountryIds.has(selectedCountry.id) : false;

  // Auto-scroll selected flag card into view
  useEffect(() => {
    if (selectedFlagId && scrollContainerRef.current) {
      const activeCard = scrollContainerRef.current.querySelector(`[data-country-id="${selectedFlagId}"]`);
      if (activeCard && typeof activeCard.scrollIntoView === 'function') {
        activeCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedFlagId]);

  // Shared Action Handlers
  const handleTriggerNameIt = () => {
    if (!selectedCountry) return;
    onNameIt(selectedCountry.id);
  };

  const handleTriggerShowMe = () => {
    if (!selectedCountry) return;
    onShowMe(selectedCountry.id);
  };

  // HTML5 Desktop Drag
  const handleDragStart = (e: React.DragEvent, countryId: string) => {
    e.dataTransfer.setData('text/plain', countryId);
    e.dataTransfer.effectAllowed = 'copyMove';
    onSelectFlag(countryId);
  };

  // Mobile Touch Handlers
  const handleTouchStart = (e: React.TouchEvent, countryId: string) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      countryId,
      time: e.timeStamp
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;

    // Only activate drag-and-drop if moving significantly upward towards the map
    if (!touchDrag?.isDragging) {
      if (dy < -25 && Math.abs(dy) > Math.abs(dx) * 1.2) {
        onSelectFlag(touchStartRef.current.countryId);
        setTouchDrag({
          countryId: touchStartRef.current.countryId,
          currentX: touch.clientX,
          currentY: touch.clientY,
          isDragging: true
        });
      }
    } else {
      setTouchDrag(prev => prev ? {
        ...prev,
        currentX: touch.clientX,
        currentY: touch.clientY
      } : null);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent, countryId: string) => {
    if (!touchStartRef.current) return;
    const { time, x: startX, y: startY } = touchStartRef.current;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;
    const dist = Math.hypot(dx, dy);
    const duration = e.timeStamp - time;

    if (touchDrag?.isDragging) {
      // Find element under touch release point
      const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
      let matchedTargetId: string | null = null;

      for (const el of elements) {
        const beaconId = el.getAttribute('data-beacon-country') || el.closest('[data-beacon-country]')?.getAttribute('data-beacon-country');
        if (beaconId) {
          matchedTargetId = beaconId;
          break;
        }
        if (el.id && el.id.startsWith('country-')) {
          matchedTargetId = el.id.replace('country-', '').replace('-placed-beacon', '').replace('-beacon', '');
          break;
        }
        const closestCountry = el.closest('[id^="country-"]');
        if (closestCountry) {
          matchedTargetId = closestCountry.id.replace('country-', '').replace('-placed-beacon', '').replace('-beacon', '');
          break;
        }
      }

      if (matchedTargetId && onDropOnCountry) {
        onDropOnCountry(matchedTargetId);
      }
    } else if (dist < 12 && duration < 400) {
      // Tap selection
      onSelectFlag(countryId);
    }

    setTouchDrag(null);
    touchStartRef.current = null;
  };

  const draggingCountry = touchDrag ? unplacedCountries.find(c => c.id === touchDrag.countryId) : null;

  return (
    <div className="flex flex-col h-full bg-[#131313] rounded-lg border border-[#222222] overflow-hidden select-none">
      {/* Top Header: Title, remaining count, and selection feedback (Order 1 on all screens) */}
      <div className="px-3 py-2 md:p-3 border-b border-[#1e1e1e] bg-[#161616] flex items-center justify-between shrink-0 order-1">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-xs sm:text-sm text-[#e5e7eb]">
            Flags
          </h2>
          <span className="px-1.5 py-0.5 bg-[#1a1a1a] text-[#777777] font-semibold text-[10px] rounded-md border border-[#2a2a2a] tabular-nums">
            {unplacedCountries.length} left
          </span>
        </div>

        {selectedCountry && (
          <div className="text-[11px] text-[#e5e7eb] font-medium truncate max-w-[150px] sm:max-w-[200px]">
            {isCurrentFlagNamed ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1 truncate">
                <IconCheck size={13} strokeWidth={2.5} className="shrink-0" /> {selectedCountry.name}
              </span>
            ) : (
              <span className="text-[#777777] italic">Tap country on map</span>
            )}
          </div>
        )}
      </div>

      {/* Global Shared Action Controls: Top on desktop (order-2), Bottom on mobile (order-3) */}
      <div className="p-2 sm:p-2.5 border-t md:border-t-0 md:border-b border-[#1e1e1e] bg-[#141414] flex items-center gap-2 shrink-0 order-3 md:order-2">
        <button
          onClick={handleTriggerNameIt}
          disabled={!selectedCountry}
          title={isCurrentFlagNamed ? `Revealed: ${selectedCountry?.name}` : "Reveal selected country name (Press N)"}
          className={`flex-1 h-10 px-3 rounded-lg font-semibold text-xs transition-all duration-150 flex items-center justify-center gap-1.5 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed ${
            isCurrentFlagNamed
              ? 'bg-emerald-950/70 border border-emerald-500/50 text-emerald-300'
              : 'bg-[#1e1e1e] hover:bg-[#282828] text-[#e5e7eb] border border-[#2a2a2a]'
          }`}
        >
          {isCurrentFlagNamed ? (
            <IconCheck size={15} strokeWidth={2.5} className="text-emerald-400 shrink-0" />
          ) : (
            <IconHelp size={15} strokeWidth={2} className="text-[#9ca3af] shrink-0" />
          )}
          <span className="truncate">
            {isCurrentFlagNamed
              ? `${selectedCountry?.name}`
              : 'Name It'}
          </span>
          {!isCurrentFlagNamed && (
            <kbd className="hidden sm:inline-block px-1.5 py-0.2 bg-[#1a1a1a] text-[10px] text-[#555555] rounded font-mono border border-[#2a2a2a] ml-0.5">
              N
            </kbd>
          )}
        </button>

        <button
          onClick={handleTriggerShowMe}
          disabled={!selectedCountry}
          title="Place this flag on the map (0 points, Press S)"
          className="flex-1 h-10 px-3 rounded-lg font-semibold text-xs bg-[#1e1e1e] hover:bg-[#282828] text-[#e5e7eb] border border-[#2a2a2a] transition-all duration-150 flex items-center justify-center gap-1.5 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <IconEye size={15} strokeWidth={2} className="text-amber-400/80 shrink-0" />
          <span>Show Me</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.2 bg-[#1a1a1a] text-[10px] text-[#555555] rounded font-mono border border-[#2a2a2a] ml-0.5">
            S
          </kbd>
        </button>
      </div>

      {/* Flag List / Carousel: Middle on mobile (order-2), Bottom on desktop (order-3) */}
      <div
        ref={scrollContainerRef}
        className="flex-1 p-2 md:p-2.5 overflow-x-auto md:overflow-x-hidden md:overflow-y-auto overscroll-contain order-2 md:order-3"
        style={{
          touchAction: 'pan-x',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div className="flex flex-row md:grid md:grid-cols-2 gap-2 md:gap-2.5 items-center md:items-stretch">
          {unplacedCountries.map((country) => {
            const isSelected = selectedCountry?.id === country.id;
            const isNamed = namedCountryIds.has(country.id);

            return (
              <div
                key={country.id}
                data-country-id={country.id}
                draggable
                tabIndex={0}
                role="button"
                aria-pressed={isSelected}
                aria-label={`Flag for ${isNamed ? country.name : 'mystery country'}`}
                onDragStart={(e) => handleDragStart(e, country.id)}
                onTouchStart={(e) => handleTouchStart(e, country.id)}
                onTouchMove={handleTouchMove}
                onTouchEnd={(e) => handleTouchEnd(e, country.id)}
                onClick={() => {
                  onSelectFlag(country.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectFlag(country.id);
                  }
                }}
                className={`relative group aspect-[4/3] w-20 min-w-[80px] sm:w-24 sm:min-w-[96px] md:w-auto shrink-0 md:shrink rounded-lg border transition-all duration-150 cursor-pointer overflow-hidden focus:outline-none flex items-center justify-center bg-[#111111] ${
                  isSelected
                    ? 'border-[#e5e7eb] ring-2 ring-white/80 shadow-[0_0_12px_rgba(255,255,255,0.06)] scale-[1.03] z-10'
                    : 'border-[#2a2a2a] hover:border-[#444444] opacity-80 hover:opacity-100'
                }`}
              >
                {/* Full Card Flag Image */}
                <FlagImage
                  countryCode={country.id}
                  countryName={isNamed ? country.name : ''}
                  className="w-full h-full object-cover"
                />

                {isSelected && (
                  <div className="absolute top-1 right-1 bg-[#f1f1f1] text-[#101010] rounded-full p-0.5 shadow-md z-10">
                    <IconCheck size={11} strokeWidth={3} />
                  </div>
                )}

                {/* If Named: Translucent Bottom Tag */}
                {isNamed && (
                  <div className="absolute inset-x-0 bottom-0 bg-[#0d0d0d]/90 backdrop-blur-sm py-0.5 px-1 text-center border-t border-[#222222] z-10">
                    <span className="text-[10px] font-bold text-white truncate block leading-tight">
                      {country.name}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Ghost Drag Preview on Touch Devices */}
      {touchDrag?.isDragging && draggingCountry && (
        <div
          className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 shadow-2xl rounded-lg border-2 border-[#e5e7eb] bg-[#141414]/95 p-1 flex items-center gap-2 backdrop-blur-md"
          style={{
            left: `${touchDrag.currentX}px`,
            top: `${touchDrag.currentY - 40}px`
          }}
        >
          <div className="w-12 h-9 rounded overflow-hidden shadow">
            <FlagImage countryCode={draggingCountry.id} countryName="" className="w-full h-full object-cover" />
          </div>
          <span className="text-[#e5e7eb] text-xs font-bold pr-1.5">Drop on Map</span>
        </div>
      )}
    </div>
  );
};
