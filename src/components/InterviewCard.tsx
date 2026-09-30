import React, { useState } from 'react';
import { Volume2, VolumeX, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { Question } from '../types';

interface InterviewCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
}

export const InterviewCard: React.FC<InterviewCardProps> = ({
  question,
  questionNumber,
  totalQuestions
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const toggleSpeak = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(question.prompt);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="p-6 md:p-8 rounded-2xl bg-white border border-[#E7E2DA] shadow-xs">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-4 border-b border-[#F0ECE4] text-xs text-[#78716C]">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#1C1917] uppercase tracking-wider">
            {question.categoryName}
          </span>
          <span aria-hidden="true">·</span>
          <span>Question {questionNumber} of {totalQuestions}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-medium text-[#78716C] bg-[#FAF8F5] border border-[#EAE5DC] px-2 py-0.5 rounded-md">
            {question.roleLevel} Level
          </span>
          {'speechSynthesis' in window && (
            <button
              onClick={toggleSpeak}
              className={`p-1.5 rounded-lg border transition-colors ${
                isSpeaking
                  ? 'border-[#E65A3C] text-[#E65A3C] bg-[#FDF2F0]'
                  : 'border-[#E7E2DA] text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAF8F5]'
              }`}
              title={isSpeaking ? 'Stop speaking' : 'Read question aloud'}
              aria-label="Read question aloud"
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Main Question Heading */}
      <div className="mt-5">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1C1917] leading-snug">
          "{question.prompt}"
        </h2>
        <p className="mt-3 text-sm text-[#57534E] leading-relaxed">
          {question.context}
        </p>
      </div>

      {/* Tips Dropdown / Accordion */}
      <div className="mt-5 pt-4 border-t border-[#F0ECE4]">
        <button
          onClick={() => setShowTips(!showTips)}
          className="flex items-center justify-between w-full text-xs font-semibold text-[#78716C] hover:text-[#1C1917] transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-[#E65A3C]" />
            Interview Preparation Guidance & Key Touchpoints
          </span>
          {showTips ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showTips && (
          <div className="mt-3 p-4 rounded-xl bg-[#FAF8F5] border border-[#ECE7DF] space-y-2.5 text-xs text-[#57534E]">
            <ul className="space-y-1.5 list-disc list-inside">
              {question.tips.map((tip, idx) => (
                <li key={idx} className="leading-relaxed">
                  {tip}
                </li>
              ))}
            </ul>

            {question.starPrompt && (
              <div className="mt-3 pt-3 border-t border-[#E5E0D6] grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded bg-white border border-[#EAE5DC]">
                  <strong className="text-[#1C1917] block font-mono">S · Situation</strong>
                  <span>{question.starPrompt.situation}</span>
                </div>
                <div className="p-2 rounded bg-white border border-[#EAE5DC]">
                  <strong className="text-[#1C1917] block font-mono">T · Task</strong>
                  <span>{question.starPrompt.task}</span>
                </div>
                <div className="p-2 rounded bg-white border border-[#EAE5DC]">
                  <strong className="text-[#1C1917] block font-mono">A · Action</strong>
                  <span>{question.starPrompt.action}</span>
                </div>
                <div className="p-2 rounded bg-white border border-[#EAE5DC]">
                  <strong className="text-[#1C1917] block font-mono">R · Result</strong>
                  <span>{question.starPrompt.result}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
