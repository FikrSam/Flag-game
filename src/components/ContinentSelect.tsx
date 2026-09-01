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
      <div className="max-w-5xl w-full flex flex-col gap-8 md:gap-12">
        {/* Top Header */}
        <div className="text-center flex flex-col items-center max-w-2xl mx-auto">
          <span className="text-[11px] sm:text-xs font-bold text-sky-400 tracking-widest uppercase mb-1.5 opacity-90">
            A Geography Drill
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
            Flaggle
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl">
            Pick a continent, then drag each flag onto the country it belongs to. No names, no multiple choice — just the shape of the border and what you can remember. <span className="text-slate-300 font-semibold">{totalPlayableFlags} flags</span> are in play today.
          </p>
        </div>

        {/* Continent Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {CONTINENTS.map((continent) => {
            const isPlayable = continent.status === 'playable';
            const silhouettePath = CONTINENT_SILHOUETTES[continent.id] || '';

            return (
              <div
                key={continent.id}
                onClick={() => isPlayable && handleSelect(continent.id)}
                className={`bg-[#0c1222] rounded-xl border p-4 flex flex-col justify-between shadow-lg transition-all ${
                  isPlayable
                    ? 'border-slate-800/90 hover:border-slate-700 cursor-pointer group hover:bg-[#0f172b]'
                    : 'border-slate-900/80 opacity-70 select-none'
                }`}
              >
                <div>
                  {/* Silhouette Graphic Container */}
                  <div className="relative w-full h-32 sm:h-36 bg-[#070c18] rounded-lg border border-slate-800/60 flex items-center justify-center overflow-hidden mb-3.5">
                    {/* SVG Continent Silhouette */}
                    {silhouettePath && (
                      <svg
                        viewBox="0 0 200 140"
                        className="w-full h-full max-h-full p-2 transition-transform duration-300 group-hover:scale-105"
                      >
                        <path
                          d={silhouettePath}
                          fill={continent.silhouetteColor}
                          opacity={isPlayable ? 0.95 : 0.4}
                          className="transition-colors duration-200"
                        />
                      </svg>
                    )}

                    {/* Top-Right Badge */}
                    <div className="absolute top-2.5 right-2.5">
                      {isPlayable ? (
                        <span className="px-2 py-0.5 bg-[#0f172a]/95 text-slate-300 font-medium text-[10px] sm:text-[11px] rounded-full border border-slate-700/60 shadow-sm backdrop-blur-xs">
                          {continent.countryCount} flags
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-slate-900/90 text-slate-500 font-bold text-[9px] tracking-wider uppercase rounded border border-slate-800/80">
                          Coming Soon
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <div className="mb-4">
                    <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                      {continent.name}
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {continent.tagline}
                    </p>
                  </div>
                </div>

                {/* Bottom Action Button */}
                {isPlayable ? (
                  <button
                    aria-label={`Play ${continent.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(continent.id);
                    }}
                    className={`w-full py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-[0.98] ${continent.buttonClass}`}
                  >
                    Play
                  </button>
                ) : (
                  <button
                    disabled
                    aria-label={`${continent.name} coming soon`}
                    className={`w-full py-2.5 px-4 rounded-lg text-xs font-medium ${continent.buttonClass}`}
                  >
                    Not yet
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom 3 Feature / Instruction Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 pt-2">
          {/* Tile 1 */}
          <div className="bg-[#0c1222] border border-slate-800/80 rounded-xl p-4 sm:p-5 text-left shadow-md">
            <h3 className="text-xs sm:text-sm font-bold text-slate-200 mb-1.5">
              Drag, or tap twice
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Drag a flag onto the map, or tap the flag then tap its country — whichever is easier on your device.
            </p>
          </div>

          {/* Tile 2 */}
          <div className="bg-[#0c1222] border border-slate-800/80 rounded-xl p-4 sm:p-5 text-left shadow-md">
            <h3 className="text-xs sm:text-sm font-bold text-slate-200 mb-1.5">
              Little countries get a dot
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Malta, Monaco and the Seychelles are too small to hit at full zoom, so they are marked with a ring. Scroll to zoom in and the rings remain visible.
            </p>
          </div>

          {/* Tile 3 */}
          <div className="bg-[#0c1222] border border-slate-800/80 rounded-xl p-4 sm:p-5 text-left shadow-md">
            <h3 className="text-xs sm:text-sm font-bold text-slate-200 mb-1.5">
              Stuck on one?
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hold a flag and use &ldquo;Name it&rdquo; for the country name, or &ldquo;Show me&rdquo; to place it for free — it just will not score.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
