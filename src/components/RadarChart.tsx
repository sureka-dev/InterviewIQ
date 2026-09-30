import React from 'react';

export interface RadarDataPoint {
  dimension: string;
  value: number; // 0 - 100
}

interface RadarChartProps {
  data: RadarDataPoint[];
  size?: number;
  strokeColor?: string;
  fillColor?: string;
  className?: string;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  data,
  size = 280,
  strokeColor = '#E65A3C',
  fillColor = 'rgba(230, 90, 60, 0.22)',
  className = ''
}) => {
  const center = size / 2;
  const radius = (size / 2) - 42; // Leave room for labels
  const totalAxes = data.length;

  // Convert polar coordinates to Cartesian
  const getCoordinates = (index: number, value: number, maxRadius: number) => {
    const angle = (Math.PI * 2 / totalAxes) * index - (Math.PI / 2);
    const r = (value / 100) * maxRadius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Generate web rings (25%, 50%, 75%, 100%)
  const rings = [0.25, 0.5, 0.75, 1.0];

  // Polygon points for candidate score
  const polygonPoints = data
    .map((d, i) => {
      const { x, y } = getCoordinates(i, Math.max(10, Math.min(100, d.value)), radius);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="overflow-visible">
        {/* Background Concentric Webs */}
        {rings.map((ringScale, rIdx) => {
          const points = data
            .map((_, i) => {
              const { x, y } = getCoordinates(i, 100, radius * ringScale);
              return `${x},${y}`;
            })
            .join(' ');
          return (
            <polygon
              key={`ring-${rIdx}`}
              points={points}
              fill="none"
              stroke="#E8E3DA"
              strokeWidth="1"
              strokeDasharray={rIdx === rings.length - 1 ? undefined : '2,2'}
            />
          );
        })}

        {/* Axis Spokes from center */}
        {data.map((_, i) => {
          const { x, y } = getCoordinates(i, 100, radius);
          return (
            <line
              key={`spoke-${i}`}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#E8E3DA"
              strokeWidth="1"
            />
          );
        })}

        {/* Candidate Value Polygon */}
        <polygon
          points={polygonPoints}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="2"
          className="transition-all duration-700 ease-out"
        />

        {/* Data Point Dots */}
        {data.map((d, i) => {
          const { x, y } = getCoordinates(i, Math.max(10, Math.min(100, d.value)), radius);
          return (
            <circle
              key={`dot-${i}`}
              cx={x}
              cy={y}
              r="3.5"
              fill="#FFFFFF"
              stroke={strokeColor}
              strokeWidth="2"
            />
          );
        })}

        {/* Labels at spoke tips */}
        {data.map((d, i) => {
          const angle = (Math.PI * 2 / totalAxes) * i - (Math.PI / 2);
          const labelDist = radius + 22;
          const lx = center + labelDist * Math.cos(angle);
          const ly = center + labelDist * Math.sin(angle);

          let textAnchor: 'start' | 'middle' | 'end' = 'middle';
          if (Math.abs(Math.cos(angle)) > 0.3) {
            textAnchor = Math.cos(angle) > 0 ? 'start' : 'end';
          }

          return (
            <g key={`label-${i}`}>
              <text
                x={lx}
                y={ly}
                textAnchor={textAnchor}
                dominantBaseline="central"
                className="fill-[#1C1917] text-[11px] font-medium"
              >
                {d.dimension}
              </text>
              <text
                x={lx}
                y={ly + 12}
                textAnchor={textAnchor}
                dominantBaseline="central"
                className="fill-[#78716C] font-mono text-[10px] font-semibold"
              >
                {Math.round(d.value)}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
