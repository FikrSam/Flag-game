import React, { useState, useRef } from 'react';
import type { CountryData } from '../types/game';
import { FlagImage } from './FlagImage';
import { HelpCircle, Eye, Check } from 'lucide-react';
import { sound } from '../utils/sound';

interface FlagDockProps {
  unplacedCountries: CountryData[];
  selectedFlagId: string | null;
  onSelectFlag: (countryId: string) => void;
  onShowMe: (countryId: string) => void;
  onDropOnCountry?: (countryId: string) => void;
}

export const FlagDock: React.FC<FlagDockProps> = ({
  unplacedCountries,
  selectedFlagId,
  onSelectFlag,
  onShowMe,
  onDropOnCountry
}) => {
  // Track country IDs that have had their name revealed via "Name it"
  const [namedCountryIds, setNamedCountryIds] = useState<Set<string>>(new Set());

  // Touch drag state
  const [touchDrag, setTouchDrag] = useState<{
    countryId: string;
    currentX: number;
    currentY: number;
    isDragging: boolean;
  } | null>(null);

  const touchStartRef = useRef<{ x: number; y: number; countryId: string; time: number } | null>(null);

  const handleNameIt = (e: React.MouseEvent | React.TouchEvent, countryId: string) => {
    e.stopPropagation();
    sound.playSelect();
    setNamedCountryIds(prev => new Set(prev).add(countryId));
  };

  const handleShowMe = (e: React.MouseEvent | React.TouchEvent, countryId: string) => {
    e.stopPropagation();
    onShowMe(countryId);
  };

  // HTML5 Desktop Drag handlers
  const handleDragStart = (e: React.DragEvent, countryId: string) => {
    e.dataTransfer.setData('text/plain', countryId);
    e.dataTransfer.effectAllowed = 'copyMove';
    sound.playSelect();
    onSelectFlag(countryId);
  };

  // Mobile Touch Drag handlers
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
    const dist = Math.hypot(dx, dy);

    if (dist > 8) {
      if (!touchDrag?.isDragging) {
        sound.playSelect();
        onSelectFlag(touchStartRef.current.countryId);
      }
      setTouchDrag({
        countryId: touchStartRef.current.countryId,
        currentX: touch.clientX,
        currentY: touch.clientY,
        isDragging: true
      });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const { countryId, time, x: startX, y: startY } = touchStartRef.current;
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
        // Match country polygon id e.g. "country-FR" or data attribute
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
    } else if (dist < 10 && duration < 350) {
      // Tap selection
      sound.playSelect();
      onSelectFlag(countryId);
    }

    setTouchDrag(null);
    touchStartRef.current = null;
  };

  const draggingCountry = touchDrag ? unplacedCountries.find(c => c.id === touchDrag.countryId) : null;

  return (
    <div className="flex flex-col h-full bg-[#0f182a] rounded-lg border border-slate-800/80 shadow-md overflow-hidden select-none">
      {/* Header */}
      <div className="px-2.5 py-1.5 md:p-3 border-b border-slate-800/80 bg-[#142036] flex items-center justify-between shrink-0">
        <h2 className="font-semibold text-[11px] md:text-xs text-slate-300">
          Flags
        </h2>
        <span className="text-[10px] md:text-[11px] text-slate-400 font-medium">
          {unplacedCountries.length} left
        </span>
      </div>

      {/* Flag List: Horizontal scrolling on mobile, 2-column grid on desktop */}
      <div className="flex-1 p-1.5 md:p-2.5 overflow-x-auto md:overflow-x-hidden md:overflow-y-auto">
        <div className="flex flex-row md:grid md:grid-cols-2 gap-1.5 md:gap-2 h-full md:h-auto items-stretch">
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
                aria-label={`Flag card. ${isNamed ? country.name : 'Unknown country'}`}
                onDragStart={(e) => handleDragStart(e, country.id)}
                onTouchStart={(e) => handleTouchStart(e, country.id)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
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
                className={`relative group flex flex-col w-24 min-w-[96px] md:w-auto shrink-0 md:shrink bg-[#111728] hover:bg-[#161f36] rounded-md border transition-all cursor-grab active:cursor-grabbing overflow-hidden shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-400 justify-between ${
                  isSelected
                    ? 'border-sky-500 ring-1 ring-sky-500 bg-[#162038]'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Flag Thumbnail (compact on mobile) */}
                <div className="relative w-full aspect-[4/3] max-h-12 md:max-h-none bg-slate-950 flex items-center justify-center overflow-hidden border-b border-slate-800/60 shrink-0">
                  <FlagImage countryCode={country.id} countryName={isNamed ? country.name : ''} className="w-full h-full object-cover" />

                  {isSelected && (
                    <div className="absolute inset-0 bg-sky-950/30 backdrop-blur-[1px] flex items-center justify-center">
                      <span className="bg-sky-600 text-white text-[9px] md:text-[10px] font-semibold px-1 py-0.5 rounded-sm shadow flex items-center gap-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[2.5]" /> Selected
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-1 md:p-1.5 flex flex-col justify-between gap-1 text-[10px] md:text-[11px] flex-1">
                  {/* Name or helper status */}
                  <div className="min-h-[14px] md:min-h-[16px] flex items-center justify-between">
                    {isNamed ? (
                      <span className="font-semibold text-slate-200 text-[10px] md:text-[11px] truncate">
                        {country.name}
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[9px] md:text-[10px] truncate">
                        {isSelected ? 'Tap map' : 'Drag / Tap'}
                      </span>
                    )}
                  </div>

                  {/* Actions: "Name it" & "Show me" */}
                  <div className="flex items-center justify-between pt-0.5 md:pt-1 border-t border-slate-800/60 gap-1 text-[9px] md:text-[10px]">
                    {!isNamed ? (
                      <button
                        onClick={(e) => handleNameIt(e, country.id)}
                        onTouchEnd={(e) => handleNameIt(e, country.id)}
                        title="Reveal country name"
                        className="text-slate-400 hover:text-sky-300 hover:bg-slate-800 px-1 py-0.5 rounded flex items-center gap-0.5 transition-colors"
                      >
                        <HelpCircle className="w-2.5 h-2.5" />
                        <span className="hidden sm:inline">Name it</span>
                        <span className="sm:hidden">Name</span>
                      </button>
                    ) : (
                      <span className="text-[9px] md:text-[10px] text-slate-500 truncate">{country.capital}</span>
                    )}

                    <button
                      onClick={(e) => handleShowMe(e, country.id)}
                      onTouchEnd={(e) => handleShowMe(e, country.id)}
                      title="Place automatically (0 points)"
                      className="text-amber-400/90 hover:text-amber-300 hover:bg-amber-500/10 px-1 py-0.5 rounded flex items-center gap-0.5 transition-colors ml-auto"
                    >
                      <Eye className="w-2.5 h-2.5" />
                      <span className="hidden sm:inline">Show me</span>
                      <span className="sm:hidden">Show</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Ghost Drag Preview on Touch Devices */}
      {touchDrag?.isDragging && draggingCountry && (
        <div
          className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 shadow-2xl rounded-md border-2 border-sky-400 bg-slate-900/95 p-1 flex items-center gap-1.5 backdrop-blur-md"
          style={{
            left: `${touchDrag.currentX}px`,
            top: `${touchDrag.currentY - 35}px`
          }}
        >
          <div className="w-10 h-7 rounded overflow-hidden shadow">
            <FlagImage countryCode={draggingCountry.id} countryName="" className="w-full h-full object-cover" />
          </div>
          <span className="text-white text-xs font-bold pr-1">Drop on Map</span>
        </div>
      )}
    </div>
  );
};
