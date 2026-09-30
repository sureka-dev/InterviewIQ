import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  Sparkles, 
  Clock, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight,
  SlidersHorizontal,
  Camera,
  Mic,
  Lightbulb,
  ShieldCheck
} from 'lucide-react';
import { CategoryCard } from '../components/CategoryCard';
import { Button } from '../components/Button';
import { CATEGORY_METADATA } from '../lib/questions';
import { InterviewCategory } from '../types';
import { WorkflowGraphic } from '../components/WorkflowGraphic';

export const PracticePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<InterviewCategory>('hr');
  const [sessionMode, setSessionMode] = useState<'full' | 'quick'>('full');

  const handleStartSession = () => {
    navigate(`/interview/${selectedCategory}?mode=${sessionMode}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-16">
      
      {/* Title & Introduction */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#E65A3C] bg-[#FDF2F0] px-3 py-1 rounded-full border border-[#FBE8E2]">
          Candidate Practice Room
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1C1917] tracking-tight">
          Choose your interview.
        </h1>
        <p className="text-base text-[#57534E] leading-relaxed">
          Select an interview category below. You'll complete a quick hardware check (camera and microphone), record your spoken answers, and receive your personalized assessment.
        </p>
      </div>

      {/* 5-Step Workflow Flow */}
      <div className="p-8 rounded-2xl bg-white border border-[#E7E2DA] shadow-xs space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#78716C]">
            Interactive Interview Flow
          </span>
          <h2 className="font-serif text-xl font-bold text-[#1C1917] mt-1">
            5 Simple Steps to Master Your Interview
          </h2>
        </div>

        <WorkflowGraphic isInteractive={true} />
      </div>

      {/* Beginner Instructions & Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-[#E7E2DA] shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] border border-[#EBE6DE] flex items-center justify-center text-[#E65A3C] mb-2">
            <Camera className="w-4 h-4" />
          </div>
          <h4 className="font-serif text-base font-bold text-[#1C1917]">
            1. Camera & Lighting
          </h4>
          <p className="text-xs text-[#57534E] leading-relaxed">
            Position your camera at eye level with steady lighting on your face. You'll get a live video check screen before recording starts.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E7E2DA] shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] border border-[#EBE6DE] flex items-center justify-center text-[#1B4332] mb-2">
            <Mic className="w-4 h-4" />
          </div>
          <h4 className="font-serif text-base font-bold text-[#1C1917]">
            2. Clear Speaking Cadence
          </h4>
          <p className="text-xs text-[#57534E] leading-relaxed">
            Speak into your microphone at a conversational pace (~140 words/min). The browser speech recognition will transcribe your words live.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E7E2DA] shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] border border-[#EBE6DE] flex items-center justify-center text-[#B45309] mb-2">
            <Lightbulb className="w-4 h-4" />
          </div>
          <h4 className="font-serif text-base font-bold text-[#1C1917]">
            3. Use the STAR Method
          </h4>
          <p className="text-xs text-[#57534E] leading-relaxed">
            Structure your answer: <strong>Situation</strong> (context), <strong>Task</strong> (goal), <strong>Action</strong> (what you did), and <strong>Result</strong> (the outcome).
          </p>
        </div>
      </div>

      {/* Mode Selector and Quick Launch Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl bg-[#FAF8F5] border border-[#ECE7DF] gap-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#78716C]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
            Session Format:
          </span>
          <div className="flex items-center gap-1 p-1 bg-white border border-[#E7E2DA] rounded-lg text-xs">
            <button
              onClick={() => setSessionMode('full')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                sessionMode === 'full'
                  ? 'bg-[#1C1917] text-white shadow-xs'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              Full Simulation (All Questions)
            </button>
            <button
              onClick={() => setSessionMode('quick')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                sessionMode === 'quick'
                  ? 'bg-[#1C1917] text-white shadow-xs'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              Quick Sprint (1 Question)
            </button>
          </div>
        </div>

        <Button
          size="md"
          variant="primary"
          onClick={handleStartSession}
          icon={<Play className="w-4 h-4 fill-white" />}
        >
          Begin {CATEGORY_METADATA[selectedCategory].name} Practice
        </Button>
      </div>

      {/* Category Cards Grid */}
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
            questionCount={sessionMode === 'quick' ? 1 : cat.questionCount}
            avgTime={sessionMode === 'quick' ? '3–4 min' : cat.avgTime}
            topics={cat.topics}
            onSelect={(c) => {
              setSelectedCategory(c);
              navigate(`/interview/${c}?mode=${sessionMode}`);
            }}
            selected={selectedCategory === cat.id}
          />
        ))}
      </div>

    </div>
  );
};
