import React from 'react';
import { EmotionEvaluation } from '../types';

interface EmotionMeterProps {
  emotion: EmotionEvaluation;
  compact?: boolean;
}

export const EmotionMeter: React.FC<EmotionMeterProps> = ({ emotion, compact = false }) => {
  const { breakdown, primaryEmotion, sentimentScore, summary } = emotion;

  const emotionMeta = {
    Enthusiastic: { color: '#E65A3C', label: 'Enthusiastic', bg: '#FDF2F0' },
    Poised: { color: '#1B4332', label: 'Poised', bg: '#EFF6F2' },
    Neutral: { color: '#78716C', label: 'Neutral', bg: '#F5F5F4' },
    Hesitant: { color: '#D97706', label: 'Hesitant', bg: '#FEF3C7' },
    Anxious: { color: '#DC2626', label: 'Anxious', bg: '#FEE2E2' },
  };

  return (
    <div className="w-full">
      {/* Primary Emotion Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-[#EAE5DC]">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#78716C] font-medium block">
            Primary Tone
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: emotionMeta[primaryEmotion]?.color || '#1C1917' }}
            />
            <span className="font-serif text-lg font-semibold text-[#1C1917]">
              {primaryEmotion}
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs uppercase tracking-wider text-[#78716C] font-medium block">
            Sentiment Polarity
          </span>
          <span className="font-mono text-sm font-semibold text-[#1C1917] tabular-nums">
            {sentimentScore > 0 ? `+${sentimentScore.toFixed(2)}` : sentimentScore.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Proportional Segment Bar */}
      <div className="mt-4">
        <div className="flex h-3 w-full overflow-hidden rounded-full bg-[#EFECE6] p-0.5 gap-0.5">
          <div
            title={`Enthusiastic: ${breakdown.enthusiastic}%`}
            style={{ width: `${breakdown.enthusiastic}%`, backgroundColor: '#E65A3C' }}
            className="h-full rounded-l-full transition-all duration-500"
          />
          <div
            title={`Poised: ${breakdown.poised}%`}
            style={{ width: `${breakdown.poised}%`, backgroundColor: '#1B4332' }}
            className="h-full transition-all duration-500"
          />
          <div
            title={`Neutral: ${breakdown.neutral}%`}
            style={{ width: `${breakdown.neutral}%`, backgroundColor: '#A8A29E' }}
            className="h-full transition-all duration-500"
          />
          <div
            title={`Hesitant: ${breakdown.hesitant}%`}
            style={{ width: `${breakdown.hesitant}%`, backgroundColor: '#D97706' }}
            className="h-full transition-all duration-500"
          />
          <div
            title={`Anxious: ${breakdown.anxious}%`}
            style={{ width: `${breakdown.anxious}%`, backgroundColor: '#DC2626' }}
            className="h-full rounded-r-full transition-all duration-500"
          />
        </div>

        {/* Legend */}
        <div className="mt-3 grid grid-cols-5 gap-1 text-center">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-[#78716C]">Enthusiastic</span>
            <span className="font-mono text-xs font-semibold text-[#E65A3C] tabular-nums">{breakdown.enthusiastic}%</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-[#78716C]">Poised</span>
            <span className="font-mono text-xs font-semibold text-[#1B4332] tabular-nums">{breakdown.poised}%</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-[#78716C]">Neutral</span>
            <span className="font-mono text-xs font-semibold text-[#78716C] tabular-nums">{breakdown.neutral}%</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-[#78716C]">Hesitant</span>
            <span className="font-mono text-xs font-semibold text-[#D97706] tabular-nums">{breakdown.hesitant}%</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-[#78716C]">Anxious</span>
            <span className="font-mono text-xs font-semibold text-[#DC2626] tabular-nums">{breakdown.anxious}%</span>
          </div>
        </div>
      </div>

      {!compact && summary && (
        <p className="mt-3.5 text-xs text-[#57534E] leading-relaxed border-t border-[#EAE5DC] pt-2.5">
          {summary}
        </p>
      )}
    </div>
  );
};
