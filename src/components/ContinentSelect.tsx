import React from 'react';
import { CONTINENTS } from '../data/continents';
import { CONTINENT_SILHOUETTES } from '../data/continentSilhouettes';
import { Logo } from './Logo';
import { IconTarget, IconHelp, IconEye } from './TablerIcons';

interface ContinentSelectProps {
  onSelectContinent: (continentId: string) => void;
  loadingContinentId?: string | null;
}

export const ContinentSelect: React.FC<ContinentSelectProps> = ({ onSelectContinent, loadingContinentId }) => {
  const handleSelect = (continentId: string) => {
    onSelectContinent(continentId);
  };

  const totalPlayableFlags = CONTINENTS
    .filter(c => c.status === 'playable')
    .reduce((sum, c) => sum + c.countryCount, 0);

  return (
    <div className="min-h-[100dvh] w-screen max-w-full bg-[#0d0d0d] text-[#f8fafc] flex flex-col items-center justify-start px-4 py-10 sm:py-14 md:py-20 select-none overflow-y-auto">
      <div className="max-w-4xl w-full flex flex-col gap-10 sm:gap-12">

        {/* Header */}
        <header className="text-center flex flex-col items-center max-w-lg mx-auto">
          <div className="flex items-center gap-3.5 mb-3">
            <Logo size={38} />
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Flaggle
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed max-w-md">
            Drag each flag onto its matching border on the map, or tap to place. {totalPlayableFlags} countries currently available.
          </p>
          {/* Subtle ornamental divider */}
          <div className="flex items-center gap-3 mt-5 w-full max-w-[200px]">
            <div className="flex-1 h-px bg-[#333333]" />
            <div className="w-1 h-1 rounded-full bg-[#4b5563]" />
            <div className="flex-1 h-px bg-[#333333]" />
          </div>
        </header>

        {/* Continent Cards Grid */}
        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {CONTINENTS.map((continent, index) => {
            const isPlayable = continent.status === 'playable';
            const silhouettePath = CONTINENT_SILHOUETTES[continent.id] || '';

            return (
              <article
                key={continent.id}
                onClick={() => isPlayable && handleSelect(continent.id)}
                style={{ animationDelay: `${index * 60}ms` }}
                className={`animate-fade-in bg-[#141414] rounded-lg border p-0 flex flex-col justify-between transition-all duration-200 group overflow-hidden ${
                  isPlayable
                    ? 'border-[#2a2a2a] hover:border-[#555555] hover:bg-[#1a1a1a] cursor-pointer hover:shadow-[0_0_24px_rgba(255,255,255,0.02)]'
                    : 'border-[#1e1e1e] opacity-45 select-none'
                }`}
              >
                <div>
                  {/* Silhouette Viewport */}
                  <div className="w-full h-36 bg-[#0f0f0f] border-b border-[#222222] flex items-center justify-center overflow-hidden relative">
                    {/* Subtle radial glow behind silhouette */}
                    {isPlayable && (
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{ background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.03) 0%, transparent 70%)' }}
                      />
                    )}
                    {silhouettePath && (
                      <svg viewBox="0 0 200 140" className="w-full h-full p-4 relative z-[1] transition-transform duration-300 group-hover:scale-[1.03]">
                        <path
                          d={silhouettePath}
                          fill={isPlayable ? '#555555' : '#2a2a2a'}
                          stroke={isPlayable ? '#666666' : '#333333'}
                          strokeWidth="0.3"
                          className="transition-all duration-300 group-hover:fill-[#6b7280]"
                        />
                      </svg>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div className="px-4 pt-3.5 pb-1.5">
                    <div className="flex items-center justify-between mb-1">
                      <h2 className="text-[15px] font-bold text-white tracking-tight">
                        {continent.name}
                      </h2>
                      <span className="text-[11px] font-medium text-[#6b7280] tabular-nums">
                        {continent.countryCount > 0 ? `${continent.countryCount} flags` : '0 flags'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#777777] leading-relaxed">
                      {continent.description}
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <div className="px-4 pb-4 pt-2.5">
                  {isPlayable ? (
                    <button
                      aria-label={`Play ${continent.name}`}
                      disabled={loadingContinentId === continent.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(continent.id);
                      }}
                      className="w-full py-2.5 px-3 rounded-lg text-xs font-bold bg-[#f1f1f1] hover:bg-white text-[#101010] transition-all duration-150 flex items-center justify-center active:scale-[0.98] disabled:opacity-75 disabled:cursor-wait group-hover:shadow-[0_1px_8px_rgba(255,255,255,0.08)]"
                    >
                      {loadingContinentId === continent.id ? (
                        <span className="flex items-center gap-1.5 animate-pulse">
                          <span className="w-2 h-2 rounded-full bg-[#101010] animate-ping" />
                          Loading {continent.name}...
                        </span>
                      ) : (
                        `Play ${continent.name}`
                      )}
                    </button>
                  ) : (
                    <button
                      disabled
                      aria-label={`${continent.name} coming soon`}
                      className="w-full py-2.5 px-3 rounded-lg text-xs font-medium bg-[#111111] border border-[#222222] text-[#555555] cursor-not-allowed"
                    >
                      Coming soon
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </main>

        {/* Footer Instructions */}
        <section aria-label="Game Instructions" className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-[#1e1e1e]">
          <div className="p-4 bg-[#131313] border border-[#222222] rounded-lg flex gap-3 items-start">
            <div className="shrink-0 mt-0.5">
              <IconTarget size={15} strokeWidth={1.8} className="text-[#6b7280]" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-[#e5e7eb] mb-1">
                Dual Controls
              </h3>
              <p className="text-[11px] text-[#777777] leading-relaxed">
                Drag flags onto the map, or tap a flag then tap its territory.
              </p>
            </div>
          </div>

          <div className="p-4 bg-[#131313] border border-[#222222] rounded-lg flex gap-3 items-start">
            <div className="shrink-0 mt-0.5">
              <IconEye size={15} strokeWidth={1.8} className="text-[#6b7280]" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-[#e5e7eb] mb-1">
                Microstate Rings
              </h3>
              <p className="text-[11px] text-[#777777] leading-relaxed">
                Small nations show target rings for easy selection at any zoom level.
              </p>
            </div>
          </div>

          <div className="p-4 bg-[#131313] border border-[#222222] rounded-lg flex gap-3 items-start">
            <div className="shrink-0 mt-0.5">
              <IconHelp size={15} strokeWidth={1.8} className="text-[#6b7280]" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-[#e5e7eb] mb-1">
                Hints & Assistance
              </h3>
              <p className="text-[11px] text-[#777777] leading-relaxed">
                Use &ldquo;Name It&rdquo; to reveal country names or &ldquo;Show Me&rdquo; to show borders.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
