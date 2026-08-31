import React from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';

interface HeaderProps {
  continentName: string;
  placedCount: number;
  totalCount: number;
  score: number;
  timeElapsed: number;
  onBackToContinents: () => void;
  onRestart: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  continentName,
  placedCount,
  totalCount,
  score,
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
    <header className="w-full bg-[#0c1220] border-b border-slate-800 px-4 py-2 flex flex-col gap-1.5 shrink-0 select-none">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Navigation & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToContinents}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-100 transition-colors py-1 px-2 rounded-md hover:bg-slate-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continents</span>
          </button>
          <span className="text-slate-700">|</span>
          <h1 className="text-sm font-bold text-slate-100 tracking-wide">
            {continentName}
          </h1>
        </div>

        {/* Right: Stats & Controls */}
        <div className="flex items-center gap-4 text-xs">
          {/* Progress */}
          <div className="text-slate-300 font-medium">
            <span className="text-white font-bold">{placedCount}</span>
            <span className="text-slate-500"> / </span>
            <span>{totalCount}</span>
          </div>

          {/* Time */}
          <div className="hidden sm:flex items-center gap-1 text-slate-400 font-mono">
            <span>TIME</span>
            <span className="text-white font-bold">{formatTime(timeElapsed)}</span>
          </div>

          {/* Score */}
          <div className="flex items-center gap-1 text-slate-400">
            <span>SCORE</span>
            <span className="text-amber-400 font-bold font-mono">{score.toLocaleString()}</span>
          </div>

          {/* Restart */}
          <button
            onClick={onRestart}
            title="Restart game"
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800/80 h-1 rounded-sm overflow-hidden">
        <div
          className="h-full bg-sky-500 transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </header>
  );
};
