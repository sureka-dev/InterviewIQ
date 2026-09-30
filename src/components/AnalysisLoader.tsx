import React, { useEffect, useState } from 'react';
import { Brain, CheckCircle2, RotateCcw } from 'lucide-react';

interface AnalysisLoaderProps {
  onComplete: () => void;
  durationMs?: number;
}

export const AnalysisLoader: React.FC<AnalysisLoaderProps> = ({
  onComplete,
  durationMs = 1800
}) => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    'Processing speech transcript and calculating word cadence...',
    'Evaluating semantic keyword relevance against job expectations...',
    'Analyzing linguistic poise, assertive ownership & filler words...',
    'Compiling executive assessment report and feedback recommendations...'
  ];

  useEffect(() => {
    const stepDuration = durationMs / steps.length;
    const interval = setInterval(() => {
      setActiveStep(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 350);
          return prev;
        }
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, [durationMs, onComplete, steps.length]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl border border-[#E7E2DA] space-y-6">
        
        {/* Animated icon and header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#FDF2F0] border border-[#FBE8E2] text-[#E65A3C] flex items-center justify-center mx-auto shadow-xs">
            <Brain className="w-7 h-7 animate-pulse" />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#1C1917]">
            Analyzing Your Answer
          </h3>
          <p className="text-xs text-[#78716C]">
            Processing your actual transcript with our client-side linguistic pipeline
          </p>
        </div>

        {/* Step progress list */}
        <div className="space-y-3 pt-2">
          {steps.map((text, idx) => {
            const isDone = idx < activeStep;
            const isCurrent = idx === activeStep;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 p-2.5 rounded-xl text-xs transition-all duration-300 ${
                  isCurrent
                    ? 'bg-[#FAF8F5] border border-[#E7E2DA] text-[#1C1917] font-semibold'
                    : isDone
                    ? 'text-[#1B4332]'
                    : 'text-[#A8A29E]'
                }`}
              >
                <div className="shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-[#1B4332]" />
                  ) : isCurrent ? (
                    <RotateCcw className="w-4 h-4 text-[#E65A3C] animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-[#D6D0C5]" />
                  )}
                </div>
                <span className="leading-snug">{text}</span>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="h-1.5 w-full rounded-full bg-[#EAE5DC] overflow-hidden">
          <div
            className="h-full bg-[#E65A3C] rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.round(((activeStep + 1) / steps.length) * 100)}%` }}
          />
        </div>

      </div>
    </div>
  );
};
