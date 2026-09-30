import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowDown, 
  HelpCircle, 
  Brain, 
  ShieldCheck, 
  Smile, 
  MessageSquare, 
  Award, 
  Sparkles, 
  Code2, 
  ArrowRight,
  Database
} from 'lucide-react';
import { Button } from '../components/Button';

export const HowItWorksPage: React.FC = () => {
  const pipeline = [
    {
      step: '01',
      title: 'Question',
      subtitle: 'Contextual Prompting',
      icon: <HelpCircle className="w-5 h-5 text-[#1C1917]" />,
      desc: 'Role-calibrated interview prompts drawn from authentic engineering, behavioral, HR, and executive question banks with explicit domain evaluation criteria.'
    },
    {
      step: '02',
      title: 'Answer',
      subtitle: 'Candidate Response Capture',
      icon: <MessageSquare className="w-5 h-5 text-[#E65A3C]" />,
      desc: 'Live input via typed prose or real-time voice speech-to-text with instantaneous tracking of word velocity and phrase formation.'
    },
    {
      step: '03',
      title: 'NLP Processing',
      subtitle: 'Linguistic & Semantic Extraction',
      icon: <Brain className="w-5 h-5 text-[#1B4332]" />,
      desc: 'Tokenization, stop-word reduction, lexical diversity (Type-Token Ratio), keyword match against domain glossaries, and Flesch-adapted readability scoring.'
    },
    {
      step: '04',
      title: 'Confidence Detection',
      subtitle: 'Conviction & Poise Analysis',
      icon: <ShieldCheck className="w-5 h-5 text-[#B45309]" />,
      desc: 'Scrutinizes verbal assertiveness. Distinguishes active first-person ownership statements ("I led", "I prioritized") from hesitant hedging qualifiers.'
    },
    {
      step: '05',
      title: 'Emotion Detection',
      subtitle: 'Sentiment & Tone Spectrum',
      icon: <Smile className="w-5 h-5 text-[#E65A3C]" />,
      desc: 'Multi-spectrum classification across enthusiastic, poised, neutral, hesitant, and anxious linguistic markers with polarity scaling from -1.0 to +1.0.'
    },
    {
      step: '06',
      title: 'Communication Analysis',
      subtitle: 'STAR Structure & Cadence',
      icon: <MessageSquare className="w-5 h-5 text-[#1B4332]" />,
      desc: 'Validates structural integrity: Situation, Task, Action, and measurable Result. Enforces optimal conciseness (120–220 words) and transition fluidity.'
    },
    {
      step: '07',
      title: 'Scoring',
      subtitle: 'Multi-Factor Synthesis',
      icon: <Award className="w-5 h-5 text-[#1C1917]" />,
      desc: 'Weighted algorithmic composite synthesizing NLP (55%), Confidence (22%), and Communication (23%) into an executive competency benchmark.'
    },
    {
      step: '08',
      title: 'Personalized Feedback',
      subtitle: 'Actionable Mentorship & Model Answers',
      icon: <Sparkles className="w-5 h-5 text-[#E65A3C]" />,
      desc: 'Concrete behavioral suggestions, pinpoint weaknesses, and comparative model answers demonstrating how a top-tier candidate answers the identical question.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-16">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#E65A3C]">
          System Architecture & Pipeline
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1C1917] tracking-tight">
          How InterviewIQ works.
        </h1>
        <p className="text-base text-[#57534E] leading-relaxed">
          An end-to-end linguistic and sentiment pipeline designed to provide objective, repeatable, and deep diagnostic candidate evaluation.
        </p>
      </div>

      {/* Visual Pipeline with Connecting Vertical / Horizontal Flow */}
      <div className="relative space-y-4">
        {pipeline.map((item, index) => (
          <div key={item.step} className="flex flex-col items-center">
            {/* Step Card */}
            <div className="w-full p-6 md:p-8 rounded-2xl bg-white border border-[#E7E2DA] shadow-xs hover:border-[#CDC5B8] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-[#ECE7DF] flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#E65A3C]">
                      STEP {item.step}
                    </span>
                    <span aria-hidden="true" className="text-[#DDD7CE]">·</span>
                    <span className="text-xs font-medium text-[#78716C]">
                      {item.subtitle}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#1C1917] mt-0.5">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed mt-2 max-w-2xl">
                    {item.desc}
                  </p>
                </div>
              </div>

              <div className="hidden sm:block shrink-0">
                <span className="text-xs font-mono font-semibold text-[#78716C] bg-[#FAF8F5] border border-[#EAE5DC] px-3 py-1 rounded-md">
                  Active Filter
                </span>
              </div>
            </div>

            {/* Connecting Arrow (Except last) */}
            {index < pipeline.length - 1 && (
              <div className="py-2 flex items-center justify-center text-[#CDC5B8]">
                <ArrowDown className="w-5 h-5 animate-bounce-subtle" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modular Architecture Note */}
      <div className="p-8 rounded-2xl bg-[#FAF8F5] border border-[#ECE7DF] space-y-4">
        <div className="flex items-center gap-3">
          <Code2 className="w-6 h-6 text-[#1C1917]" />
          <div>
            <h3 className="font-serif text-lg font-bold text-[#1C1917]">
              Engine Modular Architecture
            </h3>
            <span className="text-xs text-[#78716C]">
              Engineered with clean separation of concerns: nlp.ts, confidence.ts, emotion.ts, communication.ts, scoring.ts, and storage.ts.
            </span>
          </div>
        </div>
        <p className="text-xs text-[#57534E] leading-relaxed">
          The application runs a complete, zero-external-dependency linguistic extraction engine client-side. The analytical logic is decoupled into pure functional modules, making it trivial to swap or mirror with a Python/FastAPI microservice running spaCy, RoBERTa, or Gemini API backend routes.
        </p>
      </div>

      {/* Start Practicing CTA */}
      <div className="p-10 rounded-2xl bg-[#1C1917] text-white text-center space-y-5">
        <h2 className="font-serif text-3xl font-bold tracking-tight">
          Ready to experience the analysis firsthand?
        </h2>
        <p className="text-neutral-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
          Pick a track and complete a 5-minute simulated question to receive your personalized linguistic report.
        </p>
        <div className="pt-2">
          <Link to="/practice">
            <Button size="lg" variant="primary" icon={<ArrowRight className="w-4 h-4" />}>
              Start Practice Interview
            </Button>
          </Link>
        </div>
      </div>

    </div>
  );
};
