import React from 'react';
import { IconFlag } from './TablerIcons';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 28,
  showText = false
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <IconFlag
        size={size}
        strokeWidth={2}
        className="text-white shrink-0 transition-transform hover:scale-105 duration-200"
        aria-label="Flaggle Logo"
      />
      {showText && (
        <span className="font-bold tracking-tight text-white font-sans text-lg">
          Flaggle
        </span>
      )}
    </div>
  );
};

