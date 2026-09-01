import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { IconRotateClockwise, IconArrowLeft, IconFlame } from './TablerIcons';
import { sound } from '../utils/sound';
import { Logo } from './Logo';

interface VictoryScreenProps {
  continentName?: string;
  score: number;
  timeElapsed: number;
  totalCountries: number;
  maxStreak?: number;
  showMeCount?: number;
  nameItCount?: number;
  onPlayAgain: () => void;
  onSelectContinent: () => void;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({
  continentName = 'Continent',
  score,
  timeElapsed,
  totalCountries,
  maxStreak = 0,
  showMeCount = 0,
  nameItCount = 0,
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

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 my-4 w-full text-left text-xs">
          {/* Final Score */}
          <div className="bg-[#111111] p-2.5 rounded-lg border border-[#2b2b2b]">
            <span className="text-[10px] text-[#9ca3af] uppercase font-semibold">Final Score</span>
            <div className="text-sm font-bold text-[#38bdf8] font-mono mt-0.5">
              {score.toLocaleString()}
            </div>
          </div>

          {/* Best Streak */}
          <div className="bg-[#111111] p-2.5 rounded-lg border border-[#2b2b2b]">
            <span className="text-[10px] text-[#9ca3af] uppercase font-semibold">Best Streak</span>
            <div className="text-sm font-bold text-amber-400 font-mono mt-0.5 flex items-center gap-1">
              <IconFlame size={14} strokeWidth={2.5} className="text-amber-400 shrink-0" />
              <span>{maxStreak} in a row</span>
            </div>
          </div>

          {/* Show Me Used */}
          <div className="bg-[#111111] p-2.5 rounded-lg border border-[#2b2b2b]">
            <span className="text-[10px] text-[#9ca3af] uppercase font-semibold">Show Me Used</span>
            <div className={`text-sm font-bold font-mono mt-0.5 ${showMeCount === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {showMeCount === 0 ? '0 (Master!)' : `${showMeCount} countries`}
            </div>
          </div>

          {/* Name It Hints */}
          <div className="bg-[#111111] p-2.5 rounded-lg border border-[#2b2b2b]">
            <span className="text-[10px] text-[#9ca3af] uppercase font-semibold">Name It Hints</span>
            <div className="text-sm font-bold text-[#d1d5db] font-mono mt-0.5">
              {nameItCount === 0 ? '0 hints' : `${nameItCount} (-30% pts)`}
            </div>
          </div>
        </div>

        {/* Total Time Banner */}
        <div className="w-full bg-[#141414] py-1.5 px-3 rounded-lg border border-[#262626] mb-4 flex items-center justify-between text-xs text-[#9ca3af]">
          <span>Total Time</span>
          <span className="text-white font-bold font-mono">{formatTime(timeElapsed)}</span>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 w-full">
          <button
            onClick={onPlayAgain}
            className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5 active:scale-95"
          >
            <IconRotateClockwise size={15} strokeWidth={2} />
            Play Again
          </button>
          <button
            onClick={onSelectContinent}
            className="w-full py-2 px-4 bg-[#242424] hover:bg-[#2c2c2c] text-[#d1d5db] hover:text-white rounded-lg border border-[#383838] text-xs font-medium transition-colors flex items-center justify-center gap-1"
          >
            <IconArrowLeft size={15} strokeWidth={2} />
            Choose Another Continent
          </button>
        </div>
      </div>
    </div>
  );
};
