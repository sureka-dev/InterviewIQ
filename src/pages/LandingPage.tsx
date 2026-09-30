import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle2, 
  Brain, 
  ShieldCheck, 
  Smile, 
  MessageSquare, 
  ArrowUpRight,
  Check,
  Lightbulb,
  Sparkles
} from 'lucide-react';
import { Button } from '../components/Button';
import { CategoryCard } from '../components/CategoryCard';
import { CATEGORY_METADATA } from '../lib/questions';
import { InterviewCategory } from '../types';
import { WorkflowGraphic } from '../components/WorkflowGraphic';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectCategory = (cat: InterviewCategory) => {
    navigate(`/interview/${cat}`);
  };

  return (
    <div className="min-h-screen animate-fade-in space-y-0">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Small Label */}
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#E65A3C] bg-[#FDF2F0] px-3.5 py-1.5 rounded-full border border-[#FBE8E2]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E65A3C] animate-pulse" />
            AI-POWERED INTERVIEW PRACTICE
          </div>

          {/* Editorial Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#1C1917] leading-[1.08] text-balance">
            Your next <br />
            <span className="text-[#E65A3C] italic font-serif">great interview</span> <br />
            starts here.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-[#57534E] leading-relaxed max-w-2xl mx-auto">
            Practice realistic interviews, analyze your answers and get personalized feedback before the real interview.
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link to="/practice">
              <Button size="lg" variant="primary" icon={<ArrowRight className="w-4 h-4" />}>
                Start Practicing →
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button size="lg" variant="outline">
                How It Works
              </Button>
            </Link>
          </div>

          {/* Authentic Trust Signals */}
          <div className="pt-8 border-t border-[#EAE5DC] flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs text-[#78716C]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1B4332]" />
              <span>Real Video & Audio Capture</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1B4332]" />
              <span>Zero Fake Scores</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1B4332]" />
              <span>STAR Method Feedback</span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. HOW IT WORKS SECTION */}
      <section className="py-20 border-t border-[#E7E2DA] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#E65A3C]">
              Simple 5-Step Process
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917] tracking-tight">
              How InterviewIQ works.
            </h2>
            <p className="text-base text-[#57534E] leading-relaxed">
              A smooth, step-by-step path from track selection to camera check, live recording, and personalized feedback. Click any step to learn more.
            </p>
          </div>

          {/* Interactive 5-Step Flow Graphic */}
          <WorkflowGraphic isInteractive={true} />

        </div>
      </section>

      {/* 3. WHAT WE ANALYZE SECTION */}
      <section className="py-20 border-t border-[#E7E2DA] bg-[#F7F4EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#E65A3C]">
              Authentic Evaluation
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917] tracking-tight">
              What We Analyze
            </h2>
            <p className="text-base text-[#57534E] leading-relaxed">
              Every metric is calculated directly from your genuine spoken words, speaking cadence, and answer structure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 1. NLP Answer Analysis */}
            <div className="p-7 rounded-2xl bg-white border border-[#E7E2DA] shadow-xs hover:border-[#CDC5B8] transition-all space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#ECE7DF] flex items-center justify-center text-[#E65A3C]">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1C1917]">
                Answer Relevance & Clarity
              </h3>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Evaluates keyword alignment, sentence clarity, and detects filler words like "basically", "you know", and "kind of".
              </p>
              <ul className="space-y-1.5 text-xs text-[#78716C] pt-2 border-t border-[#F0ECE4]">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#1B4332]" /> Question keyword alignment</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#1B4332]" /> Vocabulary variety & word choice</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#1B4332]" /> Filler word frequency count</li>
              </ul>
            </div>

            {/* 2. Confidence Detection */}
            <div className="p-7 rounded-2xl bg-white border border-[#E7E2DA] shadow-xs hover:border-[#CDC5B8] transition-all space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#ECE7DF] flex items-center justify-center text-[#1B4332]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1C1917]">
                Confidence & Poise
              </h3>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Measures active ownership phrasing ("I led", "I delivered") against apologetic qualifiers and hesitation markers.
              </p>
              <ul className="space-y-1.5 text-xs text-[#78716C] pt-2 border-t border-[#F0ECE4]">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#1B4332]" /> Active first-person phrasing</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#1B4332]" /> Qualifier & hesitation flagger</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#1B4332]" /> Poise level classification</li>
              </ul>
            </div>

            {/* 3. Emotion Detection */}
            <div className="p-7 rounded-2xl bg-white border border-[#E7E2DA] shadow-xs hover:border-[#CDC5B8] transition-all space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#ECE7DF] flex items-center justify-center text-[#B45309]">
                <Smile className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1C1917]">
                Spoken Tone & Emotion
              </h3>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Determines sentiment and tone from spoken words across enthusiastic, poised, neutral, hesitant, and anxious spectrums.
              </p>
              <ul className="space-y-1.5 text-xs text-[#78716C] pt-2 border-t border-[#F0ECE4]">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#1B4332]" /> 5-Tone emotional spectrum</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#1B4332]" /> Sentiment polarity analysis</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#1B4332]" /> Composure & warmth indicators</li>
              </ul>
            </div>

            {/* 4. Communication & STAR Method */}
            <div className="p-7 rounded-2xl bg-white border border-[#E7E2DA] shadow-xs hover:border-[#CDC5B8] transition-all space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#ECE7DF] flex items-center justify-center text-[#E65A3C]">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1C1917]">
                STAR Structure & Cadence
              </h3>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Checks your spoken word count, speaking cadence, and verifies whether your answer contains all STAR story components.
              </p>
              <ul className="space-y-1.5 text-xs text-[#78716C] pt-2 border-t border-[#F0ECE4]">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#1B4332]" /> Situation, Task, Action & Result</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#1B4332]" /> Speaking pace evaluation</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#1B4332]" /> Conciseness scoring</li>
              </ul>
            </div>

            {/* 5. Personalized Feedback */}
            <div className="p-7 rounded-2xl bg-white border border-[#E7E2DA] shadow-xs hover:border-[#CDC5B8] transition-all space-y-4 md:col-span-2 lg:col-span-2">
              <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#ECE7DF] flex items-center justify-center text-[#1B4332]">
                <Lightbulb className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1C1917]">
                Personalized Feedback & Action Steps
              </h3>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Surfaces tailored guidance based on your actual response—surfacing strengths, missing question keywords, and concrete ways to structure your story.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#F0ECE4]">
                <ul className="space-y-1 text-xs text-[#78716C]">
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#1B4332]" /> Evidence-based strength cards</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#1B4332]" /> Pinpointed improvement areas</li>
                </ul>
                <ul className="space-y-1 text-xs text-[#78716C]">
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#1B4332]" /> Next-session improvement action steps</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#1B4332]" /> Printable interview report</li>
                </ul>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. INTERVIEW CATEGORIES SECTION */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#E65A3C]">
              Interview Categories
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917] mt-1">
              Choose your interview.
            </h2>
            <p className="text-sm text-[#57534E] mt-2">
              Select a specialized track tailored to your upcoming job interview format.
            </p>
          </div>
          <Link to="/practice">
            <Button variant="outline" size="sm" icon={<ArrowUpRight className="w-4 h-4" />}>
              View All Categories
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.values(CATEGORY_METADATA).map((cat) => (
            <CategoryCard
              key={cat.id}
              id={cat.id as InterviewCategory}
              name={cat.name}
              tagline={cat.tagline}
              description={cat.description}
              icon={cat.icon}
              accentColor={cat.accentColor}
              questionCount={cat.questionCount}
              avgTime={cat.avgTime}
              topics={cat.topics}
              onSelect={handleSelectCategory}
            />
          ))}
        </div>
      </section>

      {/* 5. START INTERVIEW CTA BANNER */}
      <section className="py-20 bg-[#1C1917] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs uppercase tracking-widest text-[#E65A3C] font-semibold">
            Ready for your real interview?
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white text-balance leading-tight">
            Transform nervousness into confident, structured delivery.
          </h2>
          <p className="text-neutral-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Practice with your real webcam and microphone, get instant feedback, and master the STAR method before sitting in front of hiring managers.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link to="/practice">
              <Button size="lg" variant="primary" icon={<ArrowRight className="w-4 h-4" />}>
                Start Your First Interview →
              </Button>
            </Link>
          </div>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400">
            <span>✓ 100% Free & Private</span>
            <span>✓ In-Browser Processing</span>
            <span>✓ Zero Setup Required</span>
          </div>
        </div>
      </section>

    </div>
  );
};
