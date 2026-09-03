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

export const IconFlag: React.FC<TablerIconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    className={`tabler-icon tabler-icon-flag-filled ${className}`}
    {...props}
  >
    <path d="M4 4a1 1 0 0 1 1 1v15a1 1 0 1 1 -2 0v-15a1 1 0 0 1 1 -1z" />
    <path d="M5 5a4 4 0 0 1 5.6 0a3.99 3.99 0 0 0 5.4 0l.2 -.19a1 1 0 0 1 1.6 .8v7.2a1 1 0 0 1 -.4 .8a3.99 3.99 0 0 1 -5.4 0a4.01 4.01 0 0 0 -5.6 0a1 1 0 0 1 -1.4 -.8v-7a1 1 0 0 1 0 -.81z" />
  </svg>
);


