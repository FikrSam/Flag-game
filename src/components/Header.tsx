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
    <header className="w-full bg-[#181818] border-b border-[#333333] px-2.5 sm:px-4 py-1.5 flex flex-col gap-1 shrink-0 select-none">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Navigation & Title */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <button
            onClick={onBackToContinents}
            title="Back to continent selection"
            className="flex items-center gap-1 text-xs text-[#9ca3af] hover:text-[#f8fafc] transition-colors py-1 px-1.5 rounded-md hover:bg-[#282828]"
          >
            <IconArrowLeft size={15} strokeWidth={2} />
            <span className="hidden sm:inline">Continents</span>
          </button>
          <span className="text-[#404040] hidden sm:inline">|</span>
          <Logo size={20} className="hidden sm:inline-flex" />
          <h1 className="text-xs sm:text-sm font-bold text-[#f8fafc] tracking-wide truncate">
            {continentName}
          </h1>
        </div>

        {/* Right: Stats & Controls */}
        <div className="flex items-center gap-3 sm:gap-4 text-xs">
          {/* Progress */}
          <div className="text-[#d1d5db] font-medium">
            <span className="text-[#f8fafc] font-bold">{placedCount}</span>
            <span className="text-[#6b7280]"> / </span>
            <span>{totalCount}</span>
          </div>

          {/* Live Streak (Tabler Flame Icon) */}
          {streak > 1 && (
            <div data-testid="streak-badge" className="flex items-center gap-1 text-amber-400 font-bold font-mono px-1.5 py-0.5 rounded bg-amber-950/40 border border-amber-500/30">
              <IconFlame size={14} strokeWidth={2.5} className="text-amber-400 shrink-0" />
              <span>{streak}</span>
            </div>
          )}

          {/* Time */}
          <div className="hidden sm:flex items-center gap-1 text-[#9ca3af] font-mono">
            <span>TIME</span>
            <span className="text-[#f8fafc] font-bold">{formatTime(timeElapsed)}</span>
          </div>

          {/* Score */}
          <div className="flex items-center gap-1 text-[#9ca3af]">
            <span>SCORE</span>
            <span className="text-[#f1f1f1] font-bold font-mono">{score.toLocaleString()}</span>
          </div>

          {/* Restart */}
          <button
            onClick={onRestart}
            title="Restart game (R)"
            className="p-1 text-[#9ca3af] hover:text-[#f8fafc] hover:bg-[#282828] rounded-md transition-colors flex items-center gap-1"
          >
            <IconRotateClockwise size={15} strokeWidth={2} />
            <kbd className="hidden lg:inline text-[9px] text-zinc-500 font-mono">R</kbd>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#2a2a2a] h-1 rounded-sm overflow-hidden">
        <div
          className="h-full bg-[#f1f1f1] transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </header>
  );
};
