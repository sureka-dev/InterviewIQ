import React, { useState } from 'react';
import { 
  FolderKanban, 
  Video, 
  Mic, 
  Brain, 
  Award, 
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Camera,
  Play
} from 'lucide-react';

interface WorkflowGraphicProps {
  currentStepIndex?: number;
  className?: string;
  isInteractive?: boolean;
}

export const WorkflowGraphic: React.FC<WorkflowGraphicProps> = ({
  currentStepIndex = -1,
  className = '',
  isInteractive = true
}) => {
  const [activeStep, setActiveStep] = useState<number>(
    currentStepIndex >= 0 ? currentStepIndex : 0
  );

  const steps = [
    {
      step: '01',
      title: 'Select Category',
      shortDesc: 'Choose your track',
      fullDesc: 'Pick from HR & Culture, Technical & Systems, Behavioral Leadership, or General Competency with real interview question sets.',
      icon: <FolderKanban className="w-5 h-5" />,
      tag: 'Track Selection',
      tips: ['Role-specific questions', 'Quick (1 question) or Full (3 questions)', 'Difficulty-calibrated prompts']
    },
    {
      step: '02',
      title: 'Camera & Mic Check',
      shortDesc: 'Verify hardware & lighting',
      fullDesc: 'Confirm your webcam framing, eye-level angle, and microphone sensitivity with a live audio visualizer before recording.',
      icon: <Camera className="w-5 h-5" />,
      tag: 'Hardware Setup',
      tips: ['Live video preview check', 'Real-time audio visualizer', 'Speech recognition test']
    },
    {
      step: '03',
      title: 'Record Answer',
      shortDesc: 'Speak your response naturally',
      fullDesc: 'Deliver your answer at a conversational pace while our browser speech-to-text transcribes your words in real time.',
      icon: <Mic className="w-5 h-5" />,
      tag: 'Live Capture',
      tips: ['Real-time speech-to-text', 'Live recording timer', 'Re-record whenever needed']
    },
    {
      step: '04',
      title: 'Instant Analysis',
      shortDesc: 'Evaluate your spoken answer',
      fullDesc: 'Calculates answer relevance, vocabulary variety, filler word count, confidence phrasing, and STAR structure coverage.',
      icon: <Brain className="w-5 h-5" />,
      tag: 'Genuine Evaluation',
      tips: ['Zero fake scores', 'Question keyword matching', 'Filler words flagged']
    },
    {
      step: '05',
      title: 'Feedback & Report',
      shortDesc: 'Personalized results & tips',
      fullDesc: 'Get clear strengths, pinpointed blind spots, model answer comparisons, and a printable assessment summary.',
      icon: <Award className="w-5 h-5" />,
      tag: 'Comprehensive Dossier',
      tips: ['Printable candidate report', 'Actionable improvement steps', 'Competency radar chart']
    }
  ];

  const currentActive = isInteractive ? activeStep : (currentStepIndex >= 0 ? currentStepIndex : 0);
  const activeData = steps[currentActive] || steps[0];

  return (
    <div className={`w-full space-y-6 ${className}`}>
      {/* 5-Step Progress Bar & Flow Tabs */}
      <div className="relative">
        {/* Connecting Line for Desktop */}
        <div className="hidden lg:block absolute top-7 left-12 right-12 h-0.5 bg-[#EAE5DC] -z-0" />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 relative z-10">
          {steps.map((item, idx) => {
            const isSelected = currentActive === idx;
            const isCompleted = currentStepIndex > idx;

            return (
              <button
                key={item.step}
                type="button"
                onClick={() => isInteractive && setActiveStep(idx)}
                className={`group text-left p-3.5 rounded-2xl transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-white border-2 border-[#E65A3C] shadow-sm transform -translate-y-0.5'
                    : 'bg-[#FAF8F5]/80 hover:bg-white border border-[#E7E2DA] hover:border-[#CDC5B8]'
                }`}
                aria-label={`Step ${item.step}: ${item.title}`}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-[#1B4332] text-white'
                        : isSelected
                        ? 'bg-[#E65A3C] text-white shadow-xs'
                        : 'bg-white border border-[#DDD7CE] text-[#57534E] group-hover:text-[#1C1917]'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : item.icon}
                  </div>
                  <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    isSelected ? 'bg-[#FDF2F0] text-[#E65A3C]' : 'bg-[#EAE5DC]/60 text-[#78716C]'
                  }`}>
                    {item.step}
                  </span>
                </div>

                <div>
                  <h4 className="font-serif text-sm font-bold text-[#1C1917] leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-[#78716C] mt-1 leading-snug line-clamp-1">
                    {item.shortDesc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Detail Card for currently selected step */}
      {isInteractive && (
        <div className="p-6 rounded-2xl bg-white border border-[#E7E2DA] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all duration-300">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#E65A3C] bg-[#FDF2F0] px-2.5 py-0.5 rounded-md">
                Step {activeData.step} of 05
              </span>
              <span className="text-xs text-[#78716C] font-medium">
                {activeData.tag}
              </span>
            </div>
            <h3 className="font-serif text-xl font-bold text-[#1C1917]">
              {activeData.title}
            </h3>
            <p className="text-sm text-[#57534E] leading-relaxed">
              {activeData.fullDesc}
            </p>
          </div>

          <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#ECE7DF] w-full md:w-auto md:min-w-[260px] space-y-2">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#78716C] block">
              What happens in this step:
            </span>
            <ul className="space-y-1.5 text-xs text-[#1C1917]">
              {activeData.tips.map((tip, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E65A3C]" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
