import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, ArrowLeft } from 'lucide-react';
import { sound } from '../utils/sound';

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
    <div className="fixed inset-0 z-50 bg-[#101010]/80 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-fade-in">
      <div className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-6 max-w-sm w-full shadow-2xl text-center">
        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#162638] text-[#38bdf8] text-[11px] font-semibold mb-2 border border-[#38bdf8]/50">
          Complete
        </div>

        <h2 className="text-xl font-bold text-[#f1f1f1] tracking-tight">
          {continentName} Mastered!
        </h2>
        <p className="text-xs text-[#888888] mt-1">
          You matched all {totalCountries} flags onto their correct locations.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 my-5 text-left text-xs">
          <div className="bg-[#101010] p-2.5 rounded border border-[#242424]">
            <span className="text-[10px] text-[#888888] uppercase font-semibold">Final Score</span>
            <div className="text-sm font-bold text-[#38bdf8] font-mono mt-0.5">
              {score.toLocaleString()}
            </div>
          </div>
          <div className="bg-[#101010] p-2.5 rounded border border-[#242424]">
            <span className="text-[10px] text-[#888888] uppercase font-semibold">Total Time</span>
            <div className="text-sm font-bold text-[#f1f1f1] font-mono mt-0.5">
              {formatTime(timeElapsed)}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={onPlayAgain}
            className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-500 text-[#f1f1f1] font-semibold text-xs rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5 active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Play Again
          </button>
          <button
            onClick={onSelectContinent}
            className="w-full py-2 px-4 bg-[#222222] hover:bg-[#2a2a2a] text-[#cccccc] hover:text-[#f1f1f1] rounded-lg border border-[#2e2e2e] text-xs font-medium transition-colors flex items-center justify-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Choose Another Continent
          </button>
        </div>
      </div>
    </div>
  );
};
