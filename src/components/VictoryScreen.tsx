import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  IconRotateClockwise, 
  IconArrowLeft, 
  IconFlame, 
  IconClock, 
  IconTarget, 
  IconStar,
  IconCheck,
  IconX
} from './TablerIcons';

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
    // Subtle celebratory confetti
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6, x: 0.5 },
      colors: ['#ffffff', '#f1f1f1', '#a1a1aa', '#52525b']
    });
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const totalHints = showMeCount + nameItCount;
  const isUnassisted = totalHints === 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fade-in">
      <div className="relative bg-[#111111] border border-[#262626] rounded-lg p-6 sm:p-7 max-w-sm sm:max-w-md w-full shadow-2xl text-center flex flex-col items-center">
        
        {/* Top-Right Dismiss Button */}
        <button
          onClick={onSelectContinent}
          aria-label="Close victory modal"
          className="absolute top-3.5 right-3.5 p-1.5 text-[#71717a] hover:text-white rounded-md hover:bg-[#202020] transition-colors"
        >
          <IconX size={15} strokeWidth={2} />
        </button>

        {/* Circular Flag Badge with Checkmark Sub-badge */}
        <div className="relative mb-3.5 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-[#1c1c1c] border border-[#2b2b2b] flex items-center justify-center shadow-inner">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
              <path d="M5 21V4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M5 4C9 2.5 13 5.5 19 4V13C13 14.5 9 11.5 5 13" fill="currentColor" />
            </svg>
          </div>
          <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#111111] border border-[#333333] flex items-center justify-center text-white shadow-sm">
            <IconCheck size={11} strokeWidth={3} />
          </div>
        </div>

        {/* Header Title */}
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-wider uppercase font-sans">
          {continentName} COMPLETE
        </h2>

        {/* Ornamental Divider with Center Dot */}
        <div className="flex items-center justify-center gap-2 my-2.5 w-28">
          <div className="h-[1px] bg-[#2a2a2a] flex-1" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#52525b]" />
          <div className="h-[1px] bg-[#2a2a2a] flex-1" />
        </div>

        {/* Big Hero Fraction */}
        <div className="text-4xl sm:text-5xl font-black text-white tracking-tight flex items-baseline justify-center gap-1 font-mono">
          <span>{totalCountries}</span>
          <span className="text-[#52525b] font-light">/</span>
          <span>{totalCountries}</span>
        </div>

        <div className="text-[10px] sm:text-[11px] font-bold tracking-[0.18em] text-[#71717a] uppercase mt-1">
          FLAGS MATCHED
        </div>

        <p className="text-xs text-[#a1a1aa] mt-1.5">
          {isUnassisted
            ? 'Every flag found. No hints needed.'
            : showMeCount === 0
            ? `All flags matched! ${nameItCount} hint${nameItCount > 1 ? 's' : ''} used.`
            : 'All flags matched across the continent.'}
        </p>

        {/* Horizontal 4-Column Stats Box */}
        <div className="w-full bg-[#161616] border border-[#262626] rounded-lg p-2.5 sm:p-3 my-4 grid grid-cols-4 divide-x divide-[#262626] text-center">
          {/* Col 1: Score */}
          <div className="px-1">
            <IconStar size={16} strokeWidth={2} className="text-[#a1a1aa] mx-auto mb-1" />
            <div className="text-sm sm:text-base font-bold text-white font-mono">{score.toLocaleString()}</div>
            <div className="text-[9px] font-bold text-[#71717a] tracking-wider uppercase mt-0.5">SCORE</div>
          </div>

          {/* Col 2: Best Streak */}
          <div className="px-1">
            <IconFlame size={16} strokeWidth={2} className="text-[#a1a1aa] mx-auto mb-1" />
            <div className="text-sm sm:text-base font-bold text-white font-mono">{maxStreak}</div>
            <div className="text-[9px] font-bold text-[#71717a] tracking-wider uppercase mt-0.5">BEST STREAK</div>
          </div>

          {/* Col 3: Time */}
          <div className="px-1">
            <IconClock size={16} strokeWidth={2} className="text-[#a1a1aa] mx-auto mb-1" />
            <div className="text-sm sm:text-base font-bold text-white font-mono">{formatTime(timeElapsed)}</div>
            <div className="text-[9px] font-bold text-[#71717a] tracking-wider uppercase mt-0.5">TIME</div>
          </div>

          {/* Col 4: Hints Used */}
          <div className="px-1">
            <IconTarget size={16} strokeWidth={2} className="text-[#a1a1aa] mx-auto mb-1" />
            <div className="text-sm sm:text-base font-bold text-white font-mono">{totalHints}</div>
            <div className="text-[9px] font-bold text-[#71717a] tracking-wider uppercase mt-0.5">HINTS USED</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 w-full">
          <button
            onClick={onPlayAgain}
            className="w-full py-2.5 sm:py-3 px-4 bg-[#f1f1f1] hover:bg-white text-[#101010] font-bold text-xs rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            <IconRotateClockwise size={15} strokeWidth={2.5} />
            <span>Play Again</span>
          </button>
          
          <button
            onClick={onSelectContinent}
            className="w-full py-2 sm:py-2.5 px-4 bg-[#161616] hover:bg-[#202020] text-[#a1a1aa] hover:text-white font-medium text-xs rounded-lg border border-[#262626] transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.99]"
          >
            <IconArrowLeft size={15} strokeWidth={2} />
            <span>Choose Another Region</span>
          </button>
        </div>

      </div>
    </div>
  );
};
