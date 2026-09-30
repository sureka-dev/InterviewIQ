import React from 'react';
import { Users, Cpu, Compass, Award, ArrowRight, Clock, HelpCircle } from 'lucide-react';
import { InterviewCategory } from '../types';

interface CategoryCardProps {
  id: InterviewCategory;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  accentColor: string;
  questionCount: number;
  avgTime: string;
  topics: string[];
  onSelect: (category: InterviewCategory) => void;
  selected?: boolean;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  id,
  name,
  tagline,
  description,
  accentColor,
  questionCount,
  avgTime,
  topics,
  onSelect,
  selected = false
}) => {
  const getIcon = () => {
    switch (id) {
      case 'hr':
        return <Users className="w-5 h-5 text-[#E65A3C]" />;
      case 'technical':
        return <Cpu className="w-5 h-5 text-[#1B4332]" />;
      case 'behavioral':
        return <Compass className="w-5 h-5 text-[#B45309]" />;
      case 'general':
        return <Award className="w-5 h-5 text-[#3F3F46]" />;
      default:
        return <HelpCircle className="w-5 h-5 text-[#E65A3C]" />;
    }
  };

  return (
    <div
      onClick={() => onSelect(id)}
      className={`group relative flex flex-col justify-between p-6 rounded-2xl bg-white border transition-all duration-300 cursor-pointer ${
        selected
          ? 'border-[#E65A3C] ring-2 ring-[#E65A3C]/20 shadow-md'
          : 'border-[#E7E2DA] hover:border-[#CDC5B8] shadow-xs hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      <div>
        {/* Header with icon and metadata */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#FAF8F5] border border-[#EBE6DE] group-hover:scale-105 transition-transform duration-200">
            {getIcon()}
          </div>
          <div className="flex items-center gap-2 text-xs text-[#78716C]">
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-[#A8A29E]" />
              {avgTime}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-medium text-[#1C1917]">{questionCount} prompts</span>
          </div>
        </div>

        {/* Title & Tagline */}
        <h3 className="font-serif text-xl font-bold text-[#1C1917] group-hover:text-[#E65A3C] transition-colors">
          {name}
        </h3>
        <p className="mt-1 text-xs font-medium text-[#78716C]">
          {tagline}
        </p>

        {/* Description */}
        <p className="mt-3 text-sm text-[#57534E] leading-relaxed">
          {description}
        </p>

        {/* Topic Highlights */}
        <div className="mt-4 pt-3 border-t border-[#F0ECE4]">
          <span className="text-[11px] uppercase tracking-wider text-[#A8A29E] font-medium block mb-1.5">
            Key Focus Areas
          </span>
          <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-[#57534E]">
            {topics.map((t, idx) => (
              <span key={t} className="inline-flex items-center">
                {t}
                {idx < topics.length - 1 && <span className="ml-2 text-[#D6D0C5]">·</span>}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Bottom link */}
      <div className="mt-6 pt-4 border-t border-[#F5F2EC] flex items-center justify-between text-sm font-semibold text-[#1C1917] group-hover:text-[#E65A3C]">
        <span>Start Practice</span>
        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};
