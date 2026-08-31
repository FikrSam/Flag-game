import React from 'react';
import { CONTINENTS } from '../data/continents';
import { Play, Lock } from 'lucide-react';
import { sound } from '../utils/sound';

interface ContinentSelectProps {
  onSelectContinent: (continentId: string) => void;
}

export const ContinentSelect: React.FC<ContinentSelectProps> = ({ onSelectContinent }) => {
  const handleSelectEurope = () => {
    sound.playSelect();
    onSelectContinent('europe');
  };

  return (
    <div className="min-h-screen w-screen bg-[#070b14] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-8 select-none">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            FlagQuest
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Pick a continent, then drag each flag onto the country it belongs to.
          </p>
        </div>

        {/* Continent Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {CONTINENTS.map((continent) => {
            const isPlayable = continent.status === 'playable';

            if (isPlayable) {
              return (
                <div
                  key={continent.id}
                  onClick={handleSelectEurope}
                  className="bg-[#0e1526] hover:bg-[#131d33] border border-sky-600/50 hover:border-sky-500 rounded-lg p-5 cursor-pointer shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl">{continent.icon}</span>
                      <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 font-semibold text-[10px] rounded border border-emerald-700/60">
                        Playable
                      </span>
                    </div>

                    <h2 className="text-base font-bold text-white tracking-tight">
                      {continent.name}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      {continent.countryCount} countries to match
                    </p>
                  </div>

                  <button
                    onClick={handleSelectEurope}
                    className="mt-4 w-full py-2 bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs rounded shadow-sm transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Play Europe
                  </button>
                </div>
              );
            }

            // Locked continents
            return (
              <div
                key={continent.id}
                className="bg-[#0a0f1c] border border-slate-800/60 rounded-lg p-5 opacity-50 flex flex-col justify-between select-none"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl grayscale-[60%]">{continent.icon}</span>
                    <span className="px-2 py-0.5 bg-slate-900 text-slate-500 font-medium text-[10px] rounded border border-slate-800">
                      Coming Soon
                    </span>
                  </div>

                  <h2 className="text-base font-semibold text-slate-400 tracking-tight">
                    {continent.name}
                  </h2>
                  <p className="text-xs text-slate-600 mt-1">
                    {continent.countryCount} countries
                  </p>
                </div>

                <div className="mt-4 py-1.5 bg-slate-900/50 border border-slate-800/40 text-slate-600 text-xs font-medium rounded flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3" />
                  Locked
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
