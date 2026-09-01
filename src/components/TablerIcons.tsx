import React from 'react';

export interface TablerIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  strokeWidth?: number | string;
}

const defaultProps = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const IconFlame: React.FC<TablerIconProps> = ({ size = 24, strokeWidth = 2, className = '', ...props }) => (
  <svg {...defaultProps} width={size} height={size} strokeWidth={strokeWidth} className={`tabler-icon tabler-icon-flame ${className}`} {...props}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 12c2 -2.96 0 -7 -1 -8c0 3.038 -1.773 4.741 -3 6c-1.226 1.26 -2 3.24 -2 5a6 6 0 1 0 12 0c0 -1.532 -.77 -2.94 -1.714 -4c-1.786 3 -3.286 3 -4.286 1z" />
  </svg>
);

export const IconArrowLeft: React.FC<TablerIconProps> = ({ size = 24, strokeWidth = 2, className = '', ...props }) => (
  <svg {...defaultProps} width={size} height={size} strokeWidth={strokeWidth} className={`tabler-icon tabler-icon-arrow-left ${className}`} {...props}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M5 12l14 0" />
    <path d="M5 12l6 6" />
    <path d="M5 12l6 -6" />
  </svg>
);

export const IconRotateClockwise: React.FC<TablerIconProps> = ({ size = 24, strokeWidth = 2, className = '', ...props }) => (
  <svg {...defaultProps} width={size} height={size} strokeWidth={strokeWidth} className={`tabler-icon tabler-icon-rotate-clockwise ${className}`} {...props}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M4.05 11a8 8 0 1 1 .5 4m-.5 5v-5h5" />
  </svg>
);

export const IconVolume: React.FC<TablerIconProps> = ({ size = 24, strokeWidth = 2, className = '', ...props }) => (
  <svg {...defaultProps} width={size} height={size} strokeWidth={strokeWidth} className={`tabler-icon tabler-icon-volume ${className}`} {...props}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M15 8a5 5 0 0 1 0 8" />
    <path d="M17.7 5a9 9 0 0 1 0 14" />
    <path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" />
  </svg>
);

export const IconVolumeOff: React.FC<TablerIconProps> = ({ size = 24, strokeWidth = 2, className = '', ...props }) => (
  <svg {...defaultProps} width={size} height={size} strokeWidth={strokeWidth} className={`tabler-icon tabler-icon-volume-off ${className}`} {...props}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M15 8a5 5 0 0 1 1.4 2.6" />
    <path d="M17.7 5a9 9 0 0 1 1.8 7.3" />
    <path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v3.5m0 4v6a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" />
    <path d="M3 3l18 18" />
  </svg>
);

export const IconZoomIn: React.FC<TablerIconProps> = ({ size = 24, strokeWidth = 2, className = '', ...props }) => (
  <svg {...defaultProps} width={size} height={size} strokeWidth={strokeWidth} className={`tabler-icon tabler-icon-zoom-in ${className}`} {...props}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
    <path d="M7 10l6 0" />
    <path d="M10 7l0 6" />
    <path d="M21 21l-6 -6" />
  </svg>
);

export const IconZoomOut: React.FC<TablerIconProps> = ({ size = 24, strokeWidth = 2, className = '', ...props }) => (
  <svg {...defaultProps} width={size} height={size} strokeWidth={strokeWidth} className={`tabler-icon tabler-icon-zoom-out ${className}`} {...props}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
    <path d="M7 10l6 0" />
    <path d="M21 21l-6 -6" />
  </svg>
);

export const IconCheck: React.FC<TablerIconProps> = ({ size = 24, strokeWidth = 2, className = '', ...props }) => (
  <svg {...defaultProps} width={size} height={size} strokeWidth={strokeWidth} className={`tabler-icon tabler-icon-check ${className}`} {...props}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M5 12l5 5l10 -10" />
  </svg>
);

export const IconHelp: React.FC<TablerIconProps> = ({ size = 24, strokeWidth = 2, className = '', ...props }) => (
  <svg {...defaultProps} width={size} height={size} strokeWidth={strokeWidth} className={`tabler-icon tabler-icon-help ${className}`} {...props}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <path d="M12 17l0 .01" />
    <path d="M12 13.5a1.5 1.5 0 0 1 1 -1.5a2.6 2.6 0 1 0 -3 -4" />
  </svg>
);

export const IconEye: React.FC<TablerIconProps> = ({ size = 24, strokeWidth = 2, className = '', ...props }) => (
  <svg {...defaultProps} width={size} height={size} strokeWidth={strokeWidth} className={`tabler-icon tabler-icon-eye ${className}`} {...props}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
    <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
  </svg>
);

export const IconMapPin: React.FC<TablerIconProps> = ({ size = 24, strokeWidth = 2, className = '', ...props }) => (
  <svg {...defaultProps} width={size} height={size} strokeWidth={strokeWidth} className={`tabler-icon tabler-icon-map-pin ${className}`} {...props}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
    <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />
  </svg>
);

export const IconSparkles: React.FC<TablerIconProps> = ({ size = 24, strokeWidth = 2, className = '', ...props }) => (
  <svg {...defaultProps} width={size} height={size} strokeWidth={strokeWidth} className={`tabler-icon tabler-icon-sparkles ${className}`} {...props}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 7a6 6 0 0 1 6 6a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6z" />
  </svg>
);

export const IconTrophy: React.FC<TablerIconProps> = ({ size = 24, strokeWidth = 2, className = '', ...props }) => (
  <svg {...defaultProps} width={size} height={size} strokeWidth={strokeWidth} className={`tabler-icon tabler-icon-trophy ${className}`} {...props}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M8 21l8 0" />
    <path d="M12 17l0 4" />
    <path d="M7 4l10 0" />
    <path d="M17 4v8a5 5 0 0 1 -10 0v-8" />
    <path d="M5 9m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <path d="M19 9m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  </svg>
);

export const IconClock: React.FC<TablerIconProps> = ({ size = 24, strokeWidth = 2, className = '', ...props }) => (
  <svg {...defaultProps} width={size} height={size} strokeWidth={strokeWidth} className={`tabler-icon tabler-icon-clock ${className}`} {...props}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
    <path d="M12 7v5l3 3" />
  </svg>
);

export const IconStar: React.FC<TablerIconProps> = ({ size = 24, strokeWidth = 2, className = '', ...props }) => (
  <svg {...defaultProps} width={size} height={size} strokeWidth={strokeWidth} className={`tabler-icon tabler-icon-star ${className}`} {...props}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
  </svg>
);

export const IconMedal: React.FC<TablerIconProps> = ({ size = 24, strokeWidth = 2, className = '', ...props }) => (
  <svg {...defaultProps} width={size} height={size} strokeWidth={strokeWidth} className={`tabler-icon tabler-icon-medal ${className}`} {...props}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 4v3m-4 -3v6m8 -6v6" />
    <path d="M12 18.5l-3 1.5l.5 -3.5l-2 -2l3 -.5l1.5 -3l1.5 3l3 .5l-2 2l.5 3.5z" />
  </svg>
);

export const IconTarget: React.FC<TablerIconProps> = ({ size = 24, strokeWidth = 2, className = '', ...props }) => (
  <svg {...defaultProps} width={size} height={size} strokeWidth={strokeWidth} className={`tabler-icon tabler-icon-target ${className}`} {...props}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <path d="M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" />
    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
  </svg>
);

export const IconX: React.FC<TablerIconProps> = ({ size = 24, strokeWidth = 2, className = '', ...props }) => (
  <svg {...defaultProps} width={size} height={size} strokeWidth={strokeWidth} className={`tabler-icon tabler-icon-x ${className}`} {...props}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M18 6l-12 12" />
    <path d="M6 6l12 12" />
  </svg>
);

export const IconFlag: React.FC<TablerIconProps> = ({ size = 24, strokeWidth = 2, className = '', ...props }) => (
  <svg {...defaultProps} width={size} height={size} strokeWidth={strokeWidth} className={`tabler-icon tabler-icon-flag ${className}`} {...props}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M5 5a5 5 0 0 1 7 0a5 5 0 0 0 7 0v9a5 5 0 0 1 -7 0a5 5 0 0 0 -7 0v-9z" />
    <path d="M5 21v-7" />
  </svg>
);


