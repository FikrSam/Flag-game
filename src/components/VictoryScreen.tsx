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
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-lg flex items-center justify-center p-4 select-none animate-fade-in">
      <div className="relative bg-[#0f0f0f] border border-[#222222] rounded-lg p-6 sm:p-8 max-w-sm sm:max-w-md w-full shadow-[0_0_60px_rgba(0,0,0,0.5)] text-center flex flex-col items-center">
        
        {/* Top-Right Dismiss Button */}
        <button
          onClick={onSelectContinent}
          aria-label="Close victory modal"
          className="absolute top-3.5 right-3.5 p-1.5 text-[#555555] hover:text-white rounded-md hover:bg-[#1a1a1a] transition-colors duration-150"
        >
          <IconX size={15} strokeWidth={2} />
        </button>

        {/* Circular Flag Badge with Checkmark Sub-badge */}
        <div className="relative mb-4 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-[#161616] border border-[#2a2a2a] flex items-center justify-center shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)]">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
              <path d="M5 21V4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M5 4C9 2.5 13 5.5 19 4V13C13 14.5 9 11.5 5 13" fill="currentColor" />
            </svg>
          </div>
          <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#0f0f0f] border border-[#2a2a2a] flex items-center justify-center text-emerald-400 shadow-sm">
            <IconCheck size={11} strokeWidth={3} />
          </div>
        </div>

        {/* Header Title */}
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-wider uppercase font-sans">
          {continentName} COMPLETE
        </h2>

        {/* Ornamental Divider with Center Dot */}
        <div className="flex items-center justify-center gap-2 my-3 w-32">
          <div className="h-[1px] bg-[#222222] flex-1" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#444444]" />
          <div className="h-[1px] bg-[#222222] flex-1" />
        </div>

        {/* Big Hero Fraction */}
        <div className="text-4xl sm:text-5xl font-black text-white tracking-tight flex items-baseline justify-center gap-1 font-mono tabular-nums">
          <span>{totalCountries}</span>
          <span className="text-[#333333] font-light">/</span>
          <span>{totalCountries}</span>
        </div>

        <div className="text-[10px] sm:text-[11px] font-bold tracking-[0.18em] text-[#555555] uppercase mt-1.5">
          FLAGS MATCHED
        </div>

        <p className="text-xs text-[#777777] mt-2">
          {isUnassisted
            ? 'Every flag found. No hints needed.'
            : showMeCount === 0
            ? `All flags matched! ${nameItCount} hint${nameItCount > 1 ? 's' : ''} used.`
            : 'All flags matched across the continent.'}
        </p>

        {/* Horizontal 4-Column Stats Box */}
        <div className="w-full bg-[#111111] border border-[#1e1e1e] rounded-lg p-3 sm:p-3.5 my-5 grid grid-cols-4 divide-x divide-[#1e1e1e] text-center">
          {/* Col 1: Score */}
          <div className="px-1">
            <IconStar size={15} strokeWidth={1.8} className="text-[#555555] mx-auto mb-1.5" />
            <div className="text-sm sm:text-base font-bold text-[#e5e7eb] font-mono tabular-nums">{score.toLocaleString()}</div>
            <div className="text-[9px] font-bold text-[#555555] tracking-wider uppercase mt-0.5">SCORE</div>
          </div>

          {/* Col 2: Best Streak */}
          <div className="px-1">
            <IconFlame size={15} strokeWidth={1.8} className="text-[#555555] mx-auto mb-1.5" />
            <div className="text-sm sm:text-base font-bold text-[#e5e7eb] font-mono tabular-nums">{maxStreak}</div>
            <div className="text-[9px] font-bold text-[#555555] tracking-wider uppercase mt-0.5">BEST STREAK</div>
          </div>

          {/* Col 3: Time */}
          <div className="px-1">
            <IconClock size={15} strokeWidth={1.8} className="text-[#555555] mx-auto mb-1.5" />
            <div className="text-sm sm:text-base font-bold text-[#e5e7eb] font-mono tabular-nums">{formatTime(timeElapsed)}</div>
            <div className="text-[9px] font-bold text-[#555555] tracking-wider uppercase mt-0.5">TIME</div>
          </div>

          {/* Col 4: Hints Used */}
          <div className="px-1">
            <IconTarget size={15} strokeWidth={1.8} className="text-[#555555] mx-auto mb-1.5" />
            <div className="text-sm sm:text-base font-bold text-[#e5e7eb] font-mono tabular-nums">{totalHints}</div>
            <div className="text-[9px] font-bold text-[#555555] tracking-wider uppercase mt-0.5">HINTS USED</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 w-full">
          <button
            onClick={onPlayAgain}
            className="w-full py-2.5 sm:py-3 px-4 bg-[#f1f1f1] hover:bg-white text-[#101010] font-bold text-xs rounded-lg transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] hover:shadow-[0_1px_12px_rgba(255,255,255,0.08)]"
          >
            <IconRotateClockwise size={15} strokeWidth={2.5} />
            <span>Play Again</span>
          </button>
          
          <button
            onClick={onSelectContinent}
            className="w-full py-2 sm:py-2.5 px-4 bg-[#131313] hover:bg-[#1a1a1a] text-[#777777] hover:text-[#e5e7eb] font-medium text-xs rounded-lg border border-[#222222] transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
          >
            <IconArrowLeft size={15} strokeWidth={2} />
            <span>Choose Another Region</span>
          </button>
        </div>

      </div>
    </div>
  );
};
