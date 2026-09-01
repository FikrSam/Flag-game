import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, ArrowLeft } from 'lucide-react';
import { sound } from '../utils/sound';
import { Logo } from './Logo';

interface VictoryScreenProps {
  continentName?: string;
  score: number;
  timeElapsed: number;
  totalCountries: number;
  onPlayAgain: () => void;
  onSelectContinent: () => void;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({
  continentName = 'Continent',
  score,
  timeElapsed,
  totalCountries,
  onPlayAgain,
  onSelectContinent
}) => {
  useEffect(() => {
    sound.playVictory();
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0d0d0d]/85 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-fade-in">
      <div className="bg-[#181818] border border-[#333333] rounded-lg p-6 max-w-sm w-full shadow-2xl text-center flex flex-col items-center">
        <Logo size={40} className="mb-2.5" />
        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-950/90 text-emerald-300 text-[11px] font-bold mb-2 border border-emerald-600/60">
          Complete
        </div>

        <h2 className="text-xl font-bold text-white tracking-tight">
          {continentName} Mastered!
        </h2>
        <p className="text-xs text-[#9ca3af] mt-1">
          You matched all {totalCountries} flags onto their correct locations.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 my-5 text-left text-xs">
          <div className="bg-[#111111] p-2.5 rounded-lg border border-[#2b2b2b]">
            <span className="text-[10px] text-[#9ca3af] uppercase font-semibold">Final Score</span>
            <div className="text-sm font-bold text-[#38bdf8] font-mono mt-0.5">
              {score.toLocaleString()}
            </div>
          </div>
          <div className="bg-[#111111] p-2.5 rounded-lg border border-[#2b2b2b]">
            <span className="text-[10px] text-[#9ca3af] uppercase font-semibold">Total Time</span>
            <div className="text-sm font-bold text-[#f8fafc] font-mono mt-0.5">
              {formatTime(timeElapsed)}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={onPlayAgain}
            className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5 active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Play Again
          </button>
          <button
            onClick={onSelectContinent}
            className="w-full py-2 px-4 bg-[#242424] hover:bg-[#2c2c2c] text-[#d1d5db] hover:text-white rounded-lg border border-[#383838] text-xs font-medium transition-colors flex items-center justify-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Choose Another Continent
          </button>
        </div>
      </div>
    </div>
  );
};
