import React, { useState } from 'react';
import type { CountryData } from '../types/game';
import { FlagImage } from './FlagImage';
import { HelpCircle, Eye, Check } from 'lucide-react';
import { sound } from '../utils/sound';

interface FlagDockProps {
  unplacedCountries: CountryData[];
  selectedFlagId: string | null;
  onSelectFlag: (countryId: string) => void;
  onShowMe: (countryId: string) => void;
}

export const FlagDock: React.FC<FlagDockProps> = ({
  unplacedCountries,
  selectedFlagId,
  onSelectFlag,
  onShowMe
}) => {
  // Track country IDs that have had their name revealed via "Name it"
  const [namedCountryIds, setNamedCountryIds] = useState<Set<string>>(new Set());

  const handleNameIt = (e: React.MouseEvent, countryId: string) => {
    e.stopPropagation();
    sound.playSelect();
    setNamedCountryIds(prev => new Set(prev).add(countryId));
  };

  const handleShowMe = (e: React.MouseEvent, countryId: string) => {
    e.stopPropagation();
    onShowMe(countryId);
  };

  const handleDragStart = (e: React.DragEvent, countryId: string) => {
    e.dataTransfer.setData('text/plain', countryId);
    e.dataTransfer.effectAllowed = 'copyMove';
    sound.playSelect();
    onSelectFlag(countryId);
  };

  return (
    <div className="flex flex-col h-full bg-[#0f182a] rounded-lg border border-slate-800/80 shadow-md overflow-hidden select-none">
      {/* Header */}
      <div className="p-3 border-b border-slate-800/80 bg-[#142036] flex items-center justify-between">
        <h2 className="font-semibold text-xs text-slate-300">
          Flags
        </h2>
        <span className="text-[11px] text-slate-500 font-medium">
          {unplacedCountries.length} left
        </span>
      </div>

      {/* Flag Grid */}
      <div className="flex-1 p-2.5 overflow-y-auto">
        <div className="grid grid-cols-2 gap-2">
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
                className={`relative group flex flex-col bg-[#111728] hover:bg-[#161f36] rounded-md border transition-all cursor-grab active:cursor-grabbing overflow-hidden shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-400 ${
                  isSelected
                    ? 'border-sky-500 ring-1 ring-sky-500 bg-[#162038]'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* 4x3 Flag Thumbnail */}
                <div className="relative w-full aspect-[4/3] bg-slate-950 flex items-center justify-center overflow-hidden border-b border-slate-800/60">
                  <FlagImage countryCode={country.id} countryName={isNamed ? country.name : ''} className="w-full h-full object-cover" />

                  {isSelected && (
                    <div className="absolute inset-0 bg-sky-950/30 backdrop-blur-[1px] flex items-center justify-center">
                      <span className="bg-sky-600 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-sm shadow flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[2.5]" /> Selected
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Body with Name it & Show me actions */}
                <div className="p-1.5 flex flex-col justify-between gap-1.5 text-[11px]">
                  {/* Name display (only if "Name it" clicked) */}
                  <div className="min-h-[16px] flex items-center justify-between">
                    {isNamed ? (
                      <span className="font-semibold text-slate-200 text-[11px] truncate">
                        {country.name}
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[10px]">
                        {isSelected ? 'Tap map to place' : 'Drag or tap'}
                      </span>
                    )}
                  </div>

                  {/* Actions: "Name it" & "Show me" */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 gap-1 text-[10px]">
                    {!isNamed ? (
                      <button
                        onClick={(e) => handleNameIt(e, country.id)}
                        title="Reveal country name"
                        className="text-slate-400 hover:text-sky-300 hover:bg-slate-800 px-1 py-0.5 rounded flex items-center gap-0.5 transition-colors"
                      >
                        <HelpCircle className="w-2.5 h-2.5" />
                        Name it
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-500 truncate">{country.capital}</span>
                    )}

                    <button
                      onClick={(e) => handleShowMe(e, country.id)}
                      title="Place automatically (0 points)"
                      className="text-amber-400/90 hover:text-amber-300 hover:bg-amber-500/10 px-1 py-0.5 rounded flex items-center gap-0.5 transition-colors ml-auto"
                    >
                      <Eye className="w-2.5 h-2.5" />
                      Show me
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
