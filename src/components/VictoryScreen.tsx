import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  IconRotateClockwise, 
  IconArrowLeft, 
  IconFlame, 
  IconTrophy, 
  IconSparkles, 
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
      colors: ['#6366f1', '#818cf8', '#22c55e', '#fbbf24', '#f43f5e']
    });

    const timeout = setTimeout(() => {
      confetti({
        particleCount: 35,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#6366f1', '#fbbf24', '#22c55e']
      });
      confetti({
        particleCount: 35,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#6366f1', '#fbbf24', '#22c55e']
      });
    }, 250);

    return () => clearTimeout(timeout);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  const isFlawless = showMeCount === 0 && nameItCount === 0;

  return (
    <div className="fixed inset-0 z-50 bg-[#070707]/85 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fade-in">
      <div className="relative bg-[#141414] border border-[#2e2e2e] rounded-lg p-6 sm:p-7 max-w-sm w-full shadow-2xl text-center flex flex-col items-center overflow-hidden">
        
        {/* Subtle Decorative Ambient Glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-28 bg-indigo-500/20 blur-3xl rounded-full pointer-events-none" />

        {/* Playful Floating Trophy Header */}
        <div className="relative mb-3 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-gradient-to-b from-[#242424] to-[#161616] border border-[#3a3a3a] shadow-lg flex items-center justify-center">
            <IconTrophy size={28} strokeWidth={1.75} className="text-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.3)]" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-indigo-600 rounded-full p-1 border border-[#141414] shadow-sm">
            <Logo size={14} />
          </div>
        </div>

        {/* Playful Pill Badge */}
        {isFlawless ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-950/90 text-emerald-300 text-[11px] font-bold mb-2 border border-emerald-500/60 shadow-sm">
            <IconSparkles size={12} className="text-emerald-400" />
            <span>Flawless Master</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-950/90 text-indigo-300 text-[11px] font-bold mb-2 border border-indigo-500/60 shadow-sm">
            <IconStar size={12} className="text-indigo-400" />
            <span>Continent Mastered</span>
          </div>
        )}

        {/* Header Title */}
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          {continentName} Complete!
        </h2>
        <p className="text-xs text-[#9ca3af] mt-1">
          You matched all <span className="text-white font-semibold">{totalCountries} flags</span> onto their territories.
        </p>

        {/* Hero Score Highlight Box */}
        <div className="w-full my-3.5 p-3 rounded-lg bg-gradient-to-r from-[#1a1a1a] via-[#1f1f26] to-[#1a1a1a] border border-[#333333] flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-1.5 text-[11px] text-[#a1a1aa] font-bold uppercase tracking-wider">
            <IconStar size={14} className="text-amber-400" />
            <span>Final Score</span>
          </div>
          <div className="text-xl font-black text-[#818cf8] font-mono tracking-tight flex items-baseline gap-1">
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
              <IconClock size={13} className="text-[#818cf8] shrink-0" />
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
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-bold text-xs rounded-lg shadow-md shadow-indigo-950/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
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
