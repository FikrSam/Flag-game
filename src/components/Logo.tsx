import React from 'react';

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
      {/* Bespoke Geometric Globe + Flag Vector Mark */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform hover:scale-105 duration-200"
        aria-label="Flaggle Logo"
      >
        {/* Background Dark Container */}
        <rect width="100" height="100" rx="20" fill="#141414" />
        <rect x="1.5" y="1.5" width="97" height="97" rx="18.5" stroke="#333333" strokeWidth="3" />

        {/* Globe Latitude & Longitude Meridian Grid */}
        <circle cx="50" cy="50" r="34" stroke="#4a4a4a" strokeWidth="2.5" />
        <line x1="16" y1="50" x2="84" y2="50" stroke="#333333" strokeWidth="2" strokeDasharray="3 3" />
        <ellipse cx="50" cy="50" rx="18" ry="34" stroke="#333333" strokeWidth="2" strokeDasharray="3 3" />

        {/* Mast */}
        <line x1="36" y1="72" x2="36" y2="22" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />

        {/* Geometric Flag Pennant in Electric Indigo Accent */}
        <path d="M37 24 L74 34 L66 48 L37 42 Z" fill="#6366f1" stroke="#6366f1" strokeWidth="1" strokeLinejoin="round" />
        <path d="M37 33 L55 38 L37 42 Z" fill="#4338ca" />

        {/* Mast Pin Finial */}
        <circle cx="36" cy="22" r="3.5" fill="#818cf8" stroke="#ffffff" strokeWidth="1.5" />
      </svg>

      {showText && (
        <span className="font-bold tracking-tight text-white font-sans text-lg">
          Flaggle
        </span>
      )}
    </div>
  );
};
