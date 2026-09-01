import React, { useState } from 'react';
import { ArrowLeft, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { sound } from '../utils/sound';
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
  const [isMuted, setIsMuted] = useState(sound.getIsMuted());

  const handleToggleSound = () => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
  };

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
            <ArrowLeft className="w-3.5 h-3.5" />
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

          {/* Live Streak */}
          {streak > 1 && (
            <div data-testid="streak-badge" className="flex items-center gap-1 text-amber-400 font-bold font-mono px-1.5 py-0.5 rounded bg-amber-950/40 border border-amber-500/30">
              <span className="text-xs">🔥</span>
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
            <span className="text-[#38bdf8] font-bold font-mono">{score.toLocaleString()}</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            title={isMuted ? "Unmute sound" : "Mute sound"}
            aria-label={isMuted ? "Unmute sound" : "Mute sound"}
            className="p-1 text-[#9ca3af] hover:text-[#f8fafc] hover:bg-[#282828] rounded-md transition-colors"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Restart */}
          <button
            onClick={onRestart}
            title="Restart game"
            className="p-1 text-[#9ca3af] hover:text-[#f8fafc] hover:bg-[#282828] rounded-md transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#2a2a2a] h-1 rounded-sm overflow-hidden">
        <div
          className="h-full bg-sky-500 transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </header>
  );
};
