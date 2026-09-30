import React from 'react';

interface ScoreBarProps {
  label: string;
  value: number; // 0 to 100
  secondaryText?: string;
  color?: string; // hex or tailwind class
  thresholds?: { good: number; fair: number };
}

export const ScoreBar: React.FC<ScoreBarProps> = ({
  label,
  value,
  secondaryText,
  color,
  thresholds = { good: 80, fair: 65 }
}) => {
  const normalized = Math.min(100, Math.max(0, Math.round(value)));

  // Dynamic bar color if not specified
  let barColor = color;
  if (!barColor) {
    if (normalized >= thresholds.good) {
      barColor = '#1B4332'; // Forest
    } else if (normalized >= thresholds.fair) {
      barColor = '#E65A3C'; // Coral
    } else {
      barColor = '#B45309'; // Amber
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="font-medium text-[#1C1917] tracking-tight">{label}</span>
        <div className="flex items-center gap-2">
          {secondaryText && (
            <span className="text-[11px] text-[#78716C]">{secondaryText}</span>
          )}
          <span className="font-mono text-xs font-semibold text-[#1C1917] tabular-nums">
            {normalized}%
          </span>
        </div>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[#EFECE6]">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${normalized}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  );
};
