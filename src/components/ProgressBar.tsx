import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  color?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  label,
  color = '#E65A3C'
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((current / total) * 100)));

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs mb-1.5 text-[#78716C]">
        <span>{label || `Progress (${current} of ${total})`}</span>
        <span className="font-mono font-medium text-[#1C1917] tabular-nums">
          {percentage}%
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#EAE5DC]">
        <div
          className="h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};
