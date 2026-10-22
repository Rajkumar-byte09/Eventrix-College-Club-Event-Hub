import React from 'react';

interface EventrixLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  showBadge?: boolean;
  variant?: 'default' | 'light';
  className?: string;
}

export const EventrixLogo: React.FC<EventrixLogoProps> = ({
  size = 'md',
  showTagline = true,
  showBadge = true,
  variant = 'default',
  className = '',
}) => {
  const uid = React.useId().replace(/:/g, '');

  const dimensions = {
    sm: {
      box: 'w-7 h-7 rounded-lg',
      svg: 'w-4 h-4',
      title: 'text-sm',
      subtitle: 'text-[9px]',
      gap: 'gap-2',
    },
    md: {
      box: 'w-10 h-10 rounded-xl',
      svg: 'w-6 h-6',
      title: 'text-lg sm:text-xl',
      subtitle: 'text-[10px]',
      gap: 'gap-2.5 sm:gap-3',
    },
    lg: {
      box: 'w-11 h-11 rounded-2xl',
      svg: 'w-6 h-6',
      title: 'text-xl sm:text-2xl',
      subtitle: 'text-[11px]',
      gap: 'gap-3',
    },
    xl: {
      box: 'w-14 h-14 rounded-2xl',
      svg: 'w-8 h-8',
      title: 'text-2xl sm:text-3xl',
      subtitle: 'text-xs',
      gap: 'gap-3.5',
    },
  }[size];

  const isLight = variant === 'light';

  return (
    <div className={`inline-flex items-center ${dimensions.gap} select-none group ${className}`}>
      {/* Custom Architectural Emblem Mark */}
      <div className="relative shrink-0 flex items-center justify-center">
        {/* Ambient Back-Glow on Hover */}
        <div
          className={`absolute -inset-1 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 opacity-25 group-hover:opacity-60 blur-md transition-all duration-300`}
        />

        {/* Primary Mark Container */}
        <div
          className={`relative ${dimensions.box} bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-900 dark:from-blue-600 dark:via-indigo-600 dark:to-slate-900 flex items-center justify-center shadow-md shadow-blue-600/20 dark:shadow-blue-500/25 border border-white/20 dark:border-blue-400/30 overflow-hidden transition-transform duration-300 group-hover:scale-[1.04] group-hover:-rotate-2`}
        >
          {/* Subtle top-left glass specular sheen */}
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/30 to-transparent rotate-12 pointer-events-none" />

          {/* Bespoke Vector Mark: Dynamic Geometric 'E' + Event Spark Nexus */}
          <svg
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`${dimensions.svg} relative z-10`}
          >
            <defs>
              <linearGradient id={`ev-bar-top-${uid}`} x1="6" y1="7" x2="30" y2="13" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#BAE6FD" />
              </linearGradient>
              <linearGradient id={`ev-bar-mid-${uid}`} x1="8" y1="18" x2="31" y2="18" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="50%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#67E8F9" />
              </linearGradient>
              <linearGradient id={`ev-bar-bot-${uid}`} x1="6" y1="24" x2="28" y2="29" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#E0F2FE" />
                <stop offset="100%" stopColor="#93C5FD" />
              </linearGradient>
            </defs>

            {/* Outer precision hexagon / crest frame */}
            <path
              d="M18 2.5L31.5 10.25V25.75L18 33.5L4.5 25.75V10.25L18 2.5Z"
              stroke="white"
              strokeOpacity="0.18"
              strokeWidth="1.2"
            />

            {/* Top kinetic wing of the 'E' */}
            <path
              d="M10.5 9.5H26.5L24.2 13.8H13.8L12.9 15.6H8.5L10.5 9.5Z"
              fill={`url(#ev-bar-top-${uid})`}
            />

            {/* Center high-voltage Event/Hackathon Spark bar */}
            <path
              d="M9.5 16.2H22.5L20.5 13.2L29.5 18L20.5 22.8L22.5 19.8H7.8L9.5 16.2Z"
              fill={`url(#ev-bar-mid-${uid})`}
            />

            {/* Bottom foundation wing of the 'E' */}
            <path
              d="M8.5 20.5H12.9L12.1 22.2H24.5L22.2 26.5H6.5L8.5 20.5Z"
              fill={`url(#ev-bar-bot-${uid})`}
            />

            {/* Active Campus Pulse Node */}
            <circle cx="27.5" cy="11.5" r="2" fill="#38BDF8" />
            <circle cx="27.5" cy="11.5" r="1" fill="#FFFFFF" />
          </svg>
        </div>
      </div>

      {/* Typography Lockup */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2 leading-none">
          <span
            className={`${dimensions.title} font-extrabold tracking-tight flex items-baseline ${
              isLight ? 'text-white' : 'text-slate-900 dark:text-white'
            }`}
          >
            <span>Event</span>
            <span
              className={
                isLight
                  ? 'bg-gradient-to-r from-cyan-300 via-sky-200 to-blue-200 bg-clip-text text-transparent'
                  : 'bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 dark:from-blue-400 dark:via-cyan-300 dark:to-indigo-400 bg-clip-text text-transparent'
              }
            >
              rix
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 ml-0.5 mb-0.5 inline-block group-hover:scale-125 transition-transform" />
          </span>

          {showBadge && (
            <span
              className={`text-[10px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-md border ${
                isLight
                  ? 'text-cyan-200 bg-white/10 border-white/20'
                  : 'text-blue-700 dark:text-blue-300 bg-blue-50/90 dark:bg-blue-950/80 border-blue-200/80 dark:border-blue-800/80'
              }`}
            >
              KIET
            </span>
          )}
        </div>

        {showTagline && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className={`${dimensions.subtitle} font-semibold tracking-wide ${
                isLight
                  ? 'text-blue-200/90'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Deemed to be University
            </span>
            <span
              aria-hidden="true"
              className={`hidden sm:inline-block ${
                isLight ? 'text-blue-300/50' : 'text-slate-300 dark:text-slate-600'
              }`}
            >
              ·
            </span>
            <span
              className={`hidden sm:inline-block ${dimensions.subtitle} font-medium ${
                isLight
                  ? 'text-cyan-300/90'
                  : 'text-blue-600/90 dark:text-blue-400/90'
              }`}
            >
              Campus & Hackathon Hub
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
