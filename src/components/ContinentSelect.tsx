import React from 'react';
import { CONTINENTS } from '../data/continents';
import { CONTINENT_SILHOUETTES } from '../data/continentSilhouettes';
import { sound } from '../utils/sound';

interface ContinentSelectProps {
  onSelectContinent: (continentId: string) => void;
}

export const ContinentSelect: React.FC<ContinentSelectProps> = ({ onSelectContinent }) => {
  const handleSelect = (continentId: string) => {
    sound.playSelect();
    onSelectContinent(continentId);
  };

  const totalPlayableFlags = CONTINENTS
    .filter(c => c.status === 'playable')
    .reduce((sum, c) => sum + c.countryCount, 0);

  return (
    <div className="min-h-[100dvh] w-screen max-w-full bg-[#070b14] text-slate-100 flex flex-col items-center justify-start px-4 py-8 sm:py-12 md:py-16 select-none overflow-y-auto">
      <div className="max-w-4xl w-full flex flex-col gap-8 sm:gap-10">

        {/* Minimal Header */}
        <header className="text-center flex flex-col items-center max-w-xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
            Flaggle
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Drag each flag onto its matching border on the map, or tap to place. {totalPlayableFlags} countries currently available.
          </p>
        </header>

        {/* Continent Cards Grid */}
        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {CONTINENTS.map((continent) => {
            const isPlayable = continent.status === 'playable';
            const silhouettePath = CONTINENT_SILHOUETTES[continent.id] || '';

            return (
              <article
                key={continent.id}
                onClick={() => isPlayable && handleSelect(continent.id)}
                className={`bg-[#0d1424] rounded-xl border p-4 flex flex-col justify-between transition-colors ${
                  isPlayable
                    ? 'border-slate-800 hover:border-slate-700 hover:bg-[#111a2e] cursor-pointer'
                    : 'border-slate-900/90 opacity-50 select-none'
                }`}
              >
                <div>
                  {/* Silhouette Viewport */}
                  <div className="w-full h-32 bg-[#080d1a] rounded-lg border border-slate-800/70 flex items-center justify-center overflow-hidden mb-3">
                    {silhouettePath && (
                      <svg viewBox="0 0 200 140" className="w-full h-full p-3">
                        <path
                          d={silhouettePath}
                          fill={isPlayable ? '#64748b' : '#334155'}
                          className="transition-colors"
                        />
                      </svg>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-base font-bold text-white tracking-tight">
                        {continent.name}
                      </h2>
                      <span className="text-xs font-medium text-slate-400">
                        {continent.countryCount > 0 ? `${continent.countryCount} flags` : '0 flags'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {continent.description}
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <div>
                  {isPlayable ? (
                    <button
                      aria-label={`Play ${continent.name}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(continent.id);
                      }}
                      className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white transition-colors flex items-center justify-center active:scale-[0.99]"
                    >
                      Play {continent.name}
                    </button>
                  ) : (
                    <button
                      disabled
                      aria-label={`${continent.name} coming soon`}
                      className="w-full py-2 px-3 rounded-lg text-xs font-medium bg-[#0a0f1c] border border-slate-800/80 text-slate-600 cursor-not-allowed"
                    >
                      Coming soon
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </main>

        {/* Minimal Footer Instructions */}
        <section aria-label="Game Instructions" className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 pt-2 border-t border-slate-800/80">
          <div className="p-3.5 bg-[#0a0f1d] border border-slate-800/60 rounded-xl">
            <h3 className="text-xs font-semibold text-slate-200 mb-1">
              Dual Controls
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Drag flags onto the map, or tap a flag then tap its territory.
            </p>
          </div>

          <div className="p-3.5 bg-[#0a0f1d] border border-slate-800/60 rounded-xl">
            <h3 className="text-xs font-semibold text-slate-200 mb-1">
              Microstate Rings
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Small nations show target rings for easy selection at any zoom level.
            </p>
          </div>

          <div className="p-3.5 bg-[#0a0f1d] border border-slate-800/60 rounded-xl">
            <h3 className="text-xs font-semibold text-slate-200 mb-1">
              Hints & Assistance
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Use &ldquo;Name It&rdquo; to reveal country names or &ldquo;Show Me&rdquo; to show borders.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
};
