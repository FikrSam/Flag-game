import React from 'react';
import type { CountryData, GameMode } from '../types/game';
import { FlagImage } from './FlagImage';
import { IconEye, IconMapPin, IconSparkles } from './TablerIcons';

interface MissionPanelProps {
  country: CountryData | null;
  gameMode: GameMode;
  placedCount: number;
  totalCount: number;
  hintsRemaining: number;
  hasActiveHint: boolean;
  recentCountries: CountryData[];
  onReveal: () => void;
}

export const MissionPanel: React.FC<MissionPanelProps> = ({
  country,
  gameMode,
  placedCount,
  totalCount,
  hintsRemaining,
  hasActiveHint,
  recentCountries,
  onReveal
}) => {
  const isChallenge = gameMode === 'challenge';

  return (
    <aside className="flex h-full flex-col overflow-hidden rounded-lg border border-[#bad0d7] bg-[#fffaf0] shadow-[0_10px_24px_rgba(18,59,76,0.12)]">
      <div className="border-b border-[#dce6e4] bg-[#e9f2f0] px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#416d73]">Current flag</span>
          <span className="rounded-md bg-[#fffaf0] px-2.5 py-1 text-[11px] font-bold text-[#416d73]">{placedCount + 1} of {totalCount}</span>
        </div>
      </div>

      {country ? (
        <div className="flex flex-1 flex-col p-5">
          <p className="text-sm leading-relaxed text-[#52677a]">
            {isChallenge ? 'Which country wears this flag?' : 'Find this country on the map.'}
          </p>
          <div className="mt-4 overflow-hidden rounded-lg border-4 border-white bg-[#dfe8e6] shadow-sm">
            <FlagImage countryCode={country.id} countryName={isChallenge ? 'Current flag' : country.name} className="aspect-[4/3] w-full object-cover" />
          </div>

          <div className="mt-5 rounded-lg bg-[#f3eee3] p-4">
            {isChallenge ? (
              <>
                <div className="flex items-center gap-2 text-[#17324d]">
                  <IconSparkles size={16} className="text-[#b67a16]" />
                  <span className="text-sm font-bold">Trust your memory</span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-[#637382]">Click a country to place the flag. A wrong try reveals the answer, so every turn teaches something.</p>
              </>
            ) : (
              <>
                <p className="font-serif text-2xl font-bold text-[#17324d]">{country.name}</p>
                <p className="mt-1 text-sm text-[#52677a]">Capital: <span className="font-semibold text-[#17324d]">{country.capital}</span></p>
                <p className="mt-3 border-t border-[#ddd3bf] pt-3 text-xs leading-relaxed text-[#637382]">{country.funFact}</p>
              </>
            )}
          </div>

          {isChallenge && (
            <button
              onClick={onReveal}
              disabled={hintsRemaining <= 0 || hasActiveHint}
              className={`mt-4 flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-bold transition ${
                hintsRemaining > 0 && !hasActiveHint
                  ? 'border-[#d5a33a] bg-[#fff3d4] text-[#85580e] hover:bg-[#fce8b7]'
                  : 'cursor-not-allowed border-[#dfe4e1] bg-[#f2f3f0] text-[#9aa5a6]'
              }`}
            >
              {hasActiveHint ? <IconMapPin size={16} /> : <IconEye size={16} />}
              {hasActiveHint ? 'Map pin active' : `Use a map pin · ${hintsRemaining} left`}
            </button>
          )}

          <p className="mt-4 text-center text-xs text-[#718193]">Tip: you can also use Tab, then Enter, to place a flag.</p>
        </div>
      ) : (
        <div className="grid flex-1 place-items-center p-8 text-center">
          <div>
            <IconMapPin size={32} className="mx-auto text-[#315f52]" />
            <p className="mt-3 font-serif text-xl font-bold text-[#17324d]">Route complete</p>
          </div>
        </div>
      )}

      {recentCountries.length > 0 && (
        <div className="border-t border-[#dce6e4] px-5 py-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#718193]">Recently placed</p>
          <div className="mt-2.5 flex gap-2">
            {recentCountries.map((recent) => (
              <div key={recent.id} className="min-w-0 flex-1 rounded-lg border border-[#e1dacb] bg-white p-1.5 text-center">
                <div className="mx-auto aspect-[4/3] max-w-12 overflow-hidden rounded-sm">
                  <FlagImage countryCode={recent.id} countryName={recent.name} />
                </div>
                <span className="mt-1 block truncate text-[10px] font-semibold text-[#52677a]">{recent.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};
