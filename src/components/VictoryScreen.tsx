import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  IconRotateClockwise, 
  IconArrowLeft, 
  IconFlame, 
  IconClock, 
  IconTarget, 
  IconHelp,
  IconStar 
} from './TablerIcons';
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
    // Joyful dual confetti burst
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6, x: 0.5 },
      colors: ['#ffffff', '#f1f1f1', '#e5e5e5', '#fbbf24', '#22c55e']
    });

    const timeout = setTimeout(() => {
      confetti({
        particleCount: 35,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ffffff', '#f1f1f1', '#fbbf24', '#22c55e']
      });
      confetti({
        particleCount: 35,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ffffff', '#f1f1f1', '#fbbf24', '#22c55e']
      });
    }, 250);

    return () => clearTimeout(timeout);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#070707]/85 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fade-in">
      <div className="relative bg-[#141414] border border-[#2e2e2e] rounded-lg p-6 sm:p-7 max-w-sm w-full shadow-2xl text-center flex flex-col items-center overflow-hidden">
        
        {/* Logo Mark */}
        <Logo size={36} className="mb-3" />

        {/* Header Title */}
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          {continentName} Complete!
        </h2>
        <p className="text-xs text-[#9ca3af] mt-1">
          You matched all <span className="text-white font-semibold">{totalCountries} flags</span> onto their territories.
        </p>

        {/* Hero Score Highlight Box */}
        <div className="w-full my-3.5 p-3 rounded-lg bg-gradient-to-r from-[#1a1a1a] via-[#222222] to-[#1a1a1a] border border-[#333333] flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-1.5 text-[11px] text-[#a1a1aa] font-bold uppercase tracking-wider">
            <IconStar size={14} className="text-amber-400" />
            <span>Final Score</span>
          </div>
          <div className="text-xl font-black text-[#f1f1f1] font-mono tracking-tight flex items-baseline gap-1">
            <span>{score.toLocaleString()}</span>
            <span className="text-[10px] font-sans font-semibold text-[#a1a1aa]">PTS</span>
          </div>
        </div>

        {/* 2x2 Clean & Playful Stats Cards */}
        <div className="grid grid-cols-2 gap-2 w-full text-left text-xs mb-4">
          
          {/* Best Streak */}
          <div className="bg-[#171717] p-2.5 rounded-lg border border-[#2b2b2b] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#9ca3af] text-[10px] font-bold uppercase tracking-wider">
              <span>Best Streak</span>
              <IconFlame size={13} className="text-amber-400 shrink-0" />
            </div>
            <div className="text-sm font-bold text-amber-400 font-mono mt-1 flex items-center gap-1">
              <span>{maxStreak} in a row</span>
            </div>
          </div>

          {/* Total Time */}
          <div className="bg-[#171717] p-2.5 rounded-lg border border-[#2b2b2b] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#9ca3af] text-[10px] font-bold uppercase tracking-wider">
              <span>Total Time</span>
              <IconClock size={13} className="text-[#f1f1f1] shrink-0" />
            </div>
            <div className="text-sm font-bold text-white font-mono mt-1">
              {formatTime(timeElapsed)}
            </div>
          </div>

          {/* Show Me Used */}
          <div className="bg-[#171717] p-2.5 rounded-lg border border-[#2b2b2b] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#9ca3af] text-[10px] font-bold uppercase tracking-wider">
              <span>Show Me</span>
              <IconTarget size={13} className={showMeCount === 0 ? 'text-emerald-400' : 'text-rose-400'} />
            </div>
            <div className={`text-sm font-bold font-mono mt-1 ${showMeCount === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {showMeCount === 0 ? '0 (Master!)' : `${showMeCount} used`}
            </div>
          </div>

          {/* Name It Hints */}
          <div className="bg-[#171717] p-2.5 rounded-lg border border-[#2b2b2b] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#9ca3af] text-[10px] font-bold uppercase tracking-wider">
              <span>Name Hints</span>
              <IconHelp size={13} className={nameItCount === 0 ? 'text-emerald-400' : 'text-[#d1d5db]'} />
            </div>
            <div className="text-sm font-bold text-[#d1d5db] font-mono mt-1">
              {nameItCount === 0 ? '0 hints' : `${nameItCount} (-30%)`}
            </div>
          </div>
        </div>

        {/* Playful & Clean Action Buttons */}
        <div className="flex flex-col gap-2 w-full">
          <button
            onClick={onPlayAgain}
            className="w-full py-2.5 px-4 bg-[#f1f1f1] hover:bg-white active:scale-[0.98] text-[#101010] font-bold text-xs rounded-lg shadow-md shadow-white/5 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <IconRotateClockwise size={15} strokeWidth={2.5} />
            <span>Play Again</span>
          </button>
          
          <button
            onClick={onSelectContinent}
            className="w-full py-2 px-4 bg-[#202020] hover:bg-[#282828] active:scale-[0.98] text-[#d1d5db] hover:text-white rounded-lg border border-[#333333] text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <IconArrowLeft size={15} strokeWidth={2} />
            <span>Choose Another Continent</span>
          </button>
        </div>

      </div>
    </div>
  );
};
