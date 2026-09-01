import React, { useState } from 'react';
import { CONTINENTS } from '../data/continents';
import { CONTINENT_SILHOUETTES } from '../data/continentSilhouettes';
import { sound } from '../utils/sound';
import { ArrowRight, Compass, Sparkles, Target, HelpCircle, Layers, Lock } from 'lucide-react';

interface ContinentSelectProps {
  onSelectContinent: (continentId: string) => void;
}

export const ContinentSelect: React.FC<ContinentSelectProps> = ({ onSelectContinent }) => {
  const [filter, setFilter] = useState<'all' | 'playable' | 'coming_soon'>('all');

  const handleSelect = (continentId: string) => {
    sound.playSelect();
    onSelectContinent(continentId);
  };

  const playableCount = CONTINENTS.filter(c => c.status === 'playable').length;
  const totalPlayableFlags = CONTINENTS
    .filter(c => c.status === 'playable')
    .reduce((sum, c) => sum + c.countryCount, 0);

  const displayedContinents = CONTINENTS.filter(c => {
    if (filter === 'all') return true;
    return c.status === filter;
  });

  return (
    <div className="min-h-[100dvh] w-screen max-w-full bg-[#070b14] text-slate-100 flex flex-col items-center justify-start px-4 py-8 sm:py-12 md:py-16 select-none overflow-y-auto">
      <div className="max-w-6xl w-full flex flex-col gap-8 sm:gap-10">

        {/* Hero Section */}
        <header className="text-center flex flex-col items-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0e172a] border border-sky-500/30 text-sky-300 text-xs font-semibold shadow-inner mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Interactive Cartography Drill • {playableCount} Continents Active</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-3.5">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-sky-300">
              Flaggle
            </span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-slate-400 leading-relaxed max-w-2xl mb-5">
            Master world geography through border recognition. Match sovereign flags directly to their territorial shapes with zero multiple-choice clues.
          </p>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900/90 border border-slate-800 rounded-full">
              <Compass className="w-3.5 h-3.5 text-sky-400" />
              <span><strong className="text-white">{totalPlayableFlags}</strong> Nations in Play</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900/90 border border-slate-800 rounded-full">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              <span>Vector Border Maps</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900/90 border border-slate-800 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Synthesized Audio</span>
            </div>
          </div>
        </header>

        {/* Filter Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              All Regions ({CONTINENTS.length})
            </button>
            <button
              onClick={() => setFilter('playable')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === 'playable'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              Playable Now ({playableCount})
            </button>
            <button
              onClick={() => setFilter('coming_soon')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === 'coming_soon'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              Upcoming ({CONTINENTS.length - playableCount})
            </button>
          </div>

          <span className="hidden sm:inline text-xs text-slate-500 font-medium">
            Select a region to start drilling
          </span>
        </div>

        {/* Continent Cards Grid */}
        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {displayedContinents.map((continent) => {
            const isPlayable = continent.status === 'playable';
            const silhouettePath = CONTINENT_SILHOUETTES[continent.id] || '';

            return (
              <article
                key={continent.id}
                onClick={() => isPlayable && handleSelect(continent.id)}
                className={`group relative bg-[#0b1220]/90 backdrop-blur-md rounded-2xl border p-4 sm:p-5 flex flex-col justify-between shadow-xl transition-all duration-200 overflow-hidden ${
                  isPlayable
                    ? 'border-slate-800/90 hover:border-slate-700 cursor-pointer hover:bg-[#0e172a] hover:shadow-2xl hover:-translate-y-0.5'
                    : 'border-slate-900/80 opacity-65 select-none'
                }`}
              >
                {/* Ambient Glow */}
                <div
                  className={`absolute -top-10 -right-10 w-44 h-44 bg-gradient-to-br ${continent.accentGlow} rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500`}
                />

                <div className="relative z-10">
                  {/* Silhouette Graphic Container */}
                  <div className="relative w-full h-36 bg-[#070c18]/90 rounded-xl border border-slate-800/80 flex items-center justify-center overflow-hidden mb-4 shadow-inner">
                    {/* Background Grid Accent */}
                    <div
                      className="absolute inset-0 opacity-15 pointer-events-none"
                      style={{
                        backgroundImage: 'radial-gradient(circle, #38bdf8 1px, transparent 1px)',
                        backgroundSize: '16px 16px'
                      }}
                    />

                    {/* SVG Continent Silhouette */}
                    {silhouettePath && (
                      <svg
                        viewBox="0 0 200 140"
                        className="w-full h-full p-2.5 transition-transform duration-300 group-hover:scale-105"
                      >
                        <path
                          d={silhouettePath}
                          fill={continent.silhouetteColor}
                          opacity={isPlayable ? 0.95 : 0.35}
                          className="transition-colors duration-200"
                        />
                      </svg>
                    )}

                    {/* Top Badges */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                      {isPlayable ? (
                        <>
                          {continent.difficulty && (
                            <span className="px-2 py-0.5 bg-slate-900/90 text-slate-300 font-medium text-[10px] rounded-md border border-slate-800 backdrop-blur-xs">
                              {continent.difficulty}
                            </span>
                          )}
                          <span className="px-2 py-0.5 bg-[#0f172a]/95 text-sky-300 font-bold text-[10px] sm:text-[11px] rounded-md border border-sky-500/30 shadow-sm backdrop-blur-xs">
                            {continent.countryCount} Flags
                          </span>
                        </>
                      ) : (
                        <span className="px-2 py-0.5 bg-slate-900/90 text-slate-500 font-bold text-[9px] tracking-wider uppercase rounded-md border border-slate-800 flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" /> Coming Soon
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title, Tagline & Geographic Details */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{continent.icon}</span>
                      <h2 className="text-lg font-extrabold text-white tracking-tight">
                        {continent.name}
                      </h2>
                    </div>
                    <p className="text-xs text-slate-300 font-medium leading-snug">
                      {continent.tagline}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                      <Layers className="w-3 h-3 text-slate-500 shrink-0" />
                      <span>{continent.detail}</span>
                    </p>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="relative z-10 pt-2">
                  {isPlayable ? (
                    <button
                      aria-label={`Play ${continent.name}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(continent.id);
                      }}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${continent.buttonGradient}`}
                    >
                      <span>Play {continent.name}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      disabled
                      aria-label={`${continent.name} coming soon`}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-medium ${continent.buttonGradient}`}
                    >
                      In Development
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </main>

        {/* Feature Bento Grid */}
        <section aria-label="Game Features" className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 pt-4 border-t border-slate-800/80">
          <div className="bg-[#0b1220]/70 border border-slate-800/70 rounded-2xl p-4 sm:p-5 text-left shadow-md flex flex-col gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-950/80 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Compass className="w-4 h-4" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-100">
              Dual Interaction Modes
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Drag flags directly onto the map canvas or tap to select and tap to place. Fully optimized for fluid touch screens and precision mouse controls.
            </p>
          </div>

          <div className="bg-[#0b1220]/70 border border-slate-800/70 rounded-2xl p-4 sm:p-5 text-left shadow-md flex flex-col gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Target className="w-4 h-4" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-100">
              Microstate Radar
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Vatican, Monaco, San Marino, Malta, Seychelles, and micro-territories feature permanent target rings and high-precision targeting across all zoom levels.
            </p>
          </div>

          <div className="bg-[#0b1220]/70 border border-slate-800/70 rounded-2xl p-4 sm:p-5 text-left shadow-md flex flex-col gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <HelpCircle className="w-4 h-4" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-100">
              Smart Training Assist
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Need a hint? Use &ldquo;Name It&rdquo; to identify the country name, or &ldquo;Show Me&rdquo; to reveal and highlight its geographic borders on the map.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
};
