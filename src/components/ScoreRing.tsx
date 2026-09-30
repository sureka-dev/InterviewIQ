import React from 'react';

interface ScoreRingProps {
  score: number; // 0 to 100
  size?: number; // diameter in px
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  colorScheme?: 'coral' | 'forest' | 'neutral' | 'auto';
  showGrade?: boolean;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  size = 120,
  strokeWidth = 8,
  label,
  sublabel,
  colorScheme = 'auto',
  showGrade = false
}) => {
  const normalizedScore = Math.min(100, Math.max(0, Math.round(score)));
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  let strokeColor = '#E65A3C'; // default coral
  let badgeColor = 'text-[#E65A3C]';

  if (colorScheme === 'auto') {
    if (normalizedScore >= 80) {
      strokeColor = '#1B4332'; // Forest green for high excellence
      badgeColor = 'text-[#1B4332]';
    } else if (normalizedScore >= 65) {
      strokeColor = '#E65A3C'; // Coral for good
      badgeColor = 'text-[#E65A3C]';
    } else {
      strokeColor = '#B45309'; // Amber for developing
      badgeColor = 'text-[#B45309]';
    }
  } else if (colorScheme === 'forest') {
    strokeColor = '#1B4332';
    badgeColor = 'text-[#1B4332]';
  } else if (colorScheme === 'coral') {
    strokeColor = '#E65A3C';
    badgeColor = 'text-[#E65A3C]';
  } else {
    strokeColor = '#292524';
    badgeColor = 'text-[#292524]';
  }

  const getGrade = (val: number) => {
    if (val === 0) return 'Pending';
    if (val >= 90) return 'Executive';
    if (val >= 80) return 'Proficient';
    if (val >= 70) return 'Competent';
    return 'Developing';
  };

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="-rotate-90 transform"
          aria-hidden="true"
        >
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#ECE7DF"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated Value Stroke */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-serif text-3xl font-bold tracking-tight text-[#1C1917] tabular-nums">
            {normalizedScore}
          </span>
          {showGrade ? (
            <span className={`text-[10px] font-semibold tracking-wider uppercase ${badgeColor} -mt-0.5`}>
              {getGrade(normalizedScore)}
            </span>
          ) : (
            <span className="text-[10px] font-medium text-[#78716C] -mt-0.5">/ 100</span>
          )}
        </div>
      </div>

      {label && (
        <span className="mt-2 text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
          {label}
        </span>
      )}
      {sublabel && (
        <span className="text-[11px] text-[#78716C] mt-0.5">
          {sublabel}
        </span>
      )}
    </div>
  );
};
