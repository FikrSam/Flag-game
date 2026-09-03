import React from 'react';
import { IconArrowLeft, IconRotateClockwise, IconFlame } from './TablerIcons';
import { Logo } from './Logo';

interface HeaderProps {
  continentName: string;
  placedCount: number;
  totalCount: number;
  score: number;
  streak?: number;
  timeElapsed: number;
  onBackToContinents: () => void;
  onRestart: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  continentName,
  placedCount,
  totalCount,
  score,
  streak = 0,
  timeElapsed,
  onBackToContinents,
  onRestart
}) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const percent = Math.round((placedCount / totalCount) * 100) || 0;

  return (
    <header className="w-full bg-[#141414] border-b border-[#222222] px-2.5 sm:px-4 py-1.5 flex flex-col gap-1.5 shrink-0 select-none">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Navigation & Title */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <button
            onClick={onBackToContinents}
            title="Back to continent selection"
            className="flex items-center gap-1 text-xs text-[#777777] hover:text-[#f8fafc] transition-colors duration-150 py-1 px-1.5 rounded-md hover:bg-[#1e1e1e]"
          >
            <IconArrowLeft size={15} strokeWidth={2} />
            <span className="hidden sm:inline">Continents</span>
          </button>
          <span className="text-[#2a2a2a] hidden sm:inline select-none">|</span>
          <Logo size={20} className="hidden sm:inline-flex" />
          <h1 className="text-xs sm:text-sm font-bold text-[#e5e7eb] tracking-wide truncate">
            {continentName}
          </h1>
        </div>

        {/* Right: Stats & Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 text-xs">
          {/* Progress — pill style */}
          <div className="flex items-center gap-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md px-2 py-0.5">
            <span className="text-[#f1f1f1] font-bold tabular-nums">{placedCount}</span>
            <span className="text-[#444444]">/</span>
            <span className="text-[#777777] tabular-nums">{totalCount}</span>
          </div>

          {/* Live Streak (Tabler Flame Icon) */}
          {streak > 1 && (
            <div data-testid="streak-badge" className="flex items-center gap-1 text-amber-400 font-bold font-mono px-1.5 py-0.5 rounded-md bg-amber-950/50 border border-amber-500/25 transition-all duration-200">
              <IconFlame size={13} strokeWidth={2.5} className="text-amber-400 shrink-0" />
              <span className="tabular-nums">{streak}</span>
            </div>
          )}

          {/* Time */}
          <div className="hidden sm:flex items-center gap-1.5 text-[#777777]">
            <span className="text-[10px] font-medium uppercase tracking-wide">TIME</span>
            <span className="text-[#e5e7eb] font-bold font-mono tabular-nums">{formatTime(timeElapsed)}</span>
          </div>

          {/* Score */}
          <div className="flex items-center gap-1.5 text-[#777777]">
            <span className="text-[10px] font-medium uppercase tracking-wide">SCORE</span>
            <span className="text-[#f1f1f1] font-bold font-mono tabular-nums">{score.toLocaleString()}</span>
          </div>

          {/* Restart */}
          <button
            onClick={onRestart}
            title="Restart continent (Press R)"
            className="p-1.5 text-[#555555] hover:text-[#f8fafc] hover:bg-[#1e1e1e] rounded-md transition-colors duration-150"
          >
            <IconRotateClockwise size={14} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#1a1a1a] h-[3px] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#e5e7eb] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </header>
  );
};
