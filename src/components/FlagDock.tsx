import React, { useRef, useEffect, useState } from 'react';
import type { CountryData } from '../types/game';
import { FlagImage } from './FlagImage';
import { HelpCircle, Eye, Check } from 'lucide-react';
import { sound } from '../utils/sound';

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
    sound.playSelect();
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
        sound.playSelect();
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
        if (el.id && el.id.startsWith('country-')) {
          matchedTargetId = el.id.replace('country-', '');
          break;
        }
        const dataId = el.getAttribute('data-country-id');
        if (dataId) {
          matchedTargetId = dataId;
          break;
        }
        const closestCountry = el.closest('[id^="country-"]');
        if (closestCountry) {
          matchedTargetId = closestCountry.id.replace('country-', '');
          break;
        }
      }

      if (matchedTargetId && onDropOnCountry) {
        onDropOnCountry(matchedTargetId);
      }
    } else if (dist < 12 && duration < 400) {
      // Tap selection
      sound.playSelect();
      onSelectFlag(countryId);
    }

    setTouchDrag(null);
    touchStartRef.current = null;
  };

  const draggingCountry = touchDrag ? unplacedCountries.find(c => c.id === touchDrag.countryId) : null;

  return (
    <div className="flex flex-col h-full bg-[#0f182a] rounded-lg md:rounded-xl border border-slate-800/80 shadow-md overflow-hidden select-none">
      {/* Top Header: Title, remaining count, and selection feedback (Order 1 on all screens) */}
      <div className="px-3 py-1.5 md:p-3 border-b border-slate-800/80 bg-[#131f36] flex items-center justify-between shrink-0 order-1">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-xs sm:text-sm text-slate-200">
            Flags
          </h2>
          <span className="px-1.5 py-0.5 bg-slate-800/90 text-slate-400 font-semibold text-[10px] rounded-full">
            {unplacedCountries.length} left
          </span>
        </div>

        {selectedCountry && (
          <div className="text-[11px] text-slate-300 font-medium truncate max-w-[150px] sm:max-w-[200px]">
            {isCurrentFlagNamed ? (
              <span className="text-sky-300 font-semibold flex items-center gap-1 truncate">
                <Check className="w-3 h-3 shrink-0" /> {selectedCountry.name}
              </span>
            ) : (
              <span className="text-sky-400">Tap country on map</span>
            )}
          </div>
        )}
      </div>

      {/* Global Shared Action Controls: Top on desktop (order-2), Bottom on mobile (order-3) */}
      <div className="p-2 sm:p-2.5 border-t md:border-t-0 md:border-b border-slate-800/90 bg-[#10182b] flex items-center gap-2 shrink-0 order-3 md:order-2">
        <button
          onClick={handleTriggerNameIt}
          disabled={!selectedCountry}
          title={isCurrentFlagNamed ? `Revealed: ${selectedCountry?.name}` : "Reveal selected country name"}
          className={`flex-1 h-10 px-3 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-1.5 active:scale-[0.98] shadow-sm disabled:opacity-40 disabled:cursor-not-allowed ${
            isCurrentFlagNamed
              ? 'bg-sky-950/80 border border-sky-500/60 text-sky-300'
              : 'bg-slate-800 hover:bg-slate-700 active:bg-slate-750 text-slate-100 border border-slate-700 hover:border-slate-600'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span className="truncate">
            {isCurrentFlagNamed
              ? `${selectedCountry?.name}`
              : 'Name It'}
          </span>
        </button>

        <button
          onClick={handleTriggerShowMe}
          disabled={!selectedCountry}
          title="Place this flag on the map (0 points)"
          className="flex-1 h-10 px-3 rounded-lg font-semibold text-xs bg-slate-800 hover:bg-slate-700 active:bg-slate-750 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Eye className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span>Show Me</span>
        </button>
      </div>

      {/* Flag List / Carousel: Middle on mobile (order-2), Bottom on desktop (order-3) */}
      <div
        ref={scrollContainerRef}
        className="flex-1 p-2 md:p-3 overflow-x-auto md:overflow-x-hidden md:overflow-y-auto overscroll-contain order-2 md:order-3"
        style={{
          touchAction: 'pan-x',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div className="flex flex-row md:grid md:grid-cols-2 gap-2 md:gap-2.5 h-full md:h-auto items-stretch">
          {unplacedCountries.map((country) => {
            const isSelected = selectedFlagId === country.id;
            const isNamed = namedCountryIds.has(country.id);

            return (
              <div
                key={country.id}
                data-country-id={country.id}
                draggable
                tabIndex={0}
                role="button"
                aria-pressed={isSelected}
                aria-label={`Flag card. ${isNamed ? country.name : 'Unknown flag'}`}
                onDragStart={(e) => handleDragStart(e, country.id)}
                onTouchStart={(e) => handleTouchStart(e, country.id)}
                onTouchMove={handleTouchMove}
                onTouchEnd={(e) => handleTouchEnd(e, country.id)}
                onClick={() => {
                  sound.playSelect();
                  onSelectFlag(country.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    sound.playSelect();
                    onSelectFlag(country.id);
                  }
                }}
                className={`relative group flex flex-col w-20 min-w-[80px] sm:w-24 sm:min-w-[96px] md:w-auto shrink-0 md:shrink rounded-lg border transition-all cursor-pointer overflow-hidden shadow-sm focus:outline-none ${
                  isSelected
                    ? 'border-sky-400 ring-2 ring-sky-400/90 bg-[#16223d] shadow-md shadow-sky-950/50 scale-[1.03] z-10'
                    : 'border-slate-800/90 bg-[#11182a] hover:bg-[#151f36] hover:border-slate-700 opacity-80 hover:opacity-100'
                }`}
              >
                {/* Flag Thumbnail Tile */}
                <div className="relative w-full aspect-[4/3] bg-slate-950 flex items-center justify-center overflow-hidden">
                  <FlagImage countryCode={country.id} countryName={isNamed ? country.name : ''} className="w-full h-full object-cover" />

                  {isSelected && (
                    <div className="absolute top-1 right-1 bg-sky-600 text-white rounded-full p-0.5 shadow-md z-10">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}

                  {/* If Named: Translucent Bottom Tag */}
                  {isNamed && (
                    <div className="absolute inset-x-0 bottom-0 bg-slate-950/90 backdrop-blur-xs py-0.5 px-1 text-center border-t border-slate-700/60 z-10">
                      <span className="text-[10px] font-bold text-white truncate block leading-tight">
                        {country.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Ghost Drag Preview on Touch Devices */}
      {touchDrag?.isDragging && draggingCountry && (
        <div
          className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 shadow-2xl rounded-lg border-2 border-sky-400 bg-slate-900/95 p-1 flex items-center gap-2 backdrop-blur-md"
          style={{
            left: `${touchDrag.currentX}px`,
            top: `${touchDrag.currentY - 40}px`
          }}
        >
          <div className="w-12 h-9 rounded overflow-hidden shadow">
            <FlagImage countryCode={draggingCountry.id} countryName="" className="w-full h-full object-cover" />
          </div>
          <span className="text-white text-xs font-bold pr-1.5">Drop on Map</span>
        </div>
      )}
    </div>
  );
};
