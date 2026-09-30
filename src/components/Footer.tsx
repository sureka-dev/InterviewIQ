import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#E7E2DA] bg-[#F7F4EE] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#E65A3C] flex items-center justify-center text-white font-serif font-bold text-base shadow-xs">
                Q
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-[#1C1917]">
                Interview<span className="text-[#E65A3C]">IQ</span>
              </span>
            </Link>
            <p className="font-serif text-sm italic text-[#57534E]">
              “Practice Smarter. Interview Better.”
            </p>
            <p className="text-xs text-[#78716C] max-w-sm leading-relaxed">
              AI Smart Interview Analyzer combining natural language processing, delivery poise heuristics, sentiment detection, and structured candidate evaluation.
            </p>
          </div>

          {/* Practice Tracks */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1C1917] mb-3">
              Practice Tracks
            </h4>
            <ul className="space-y-2 text-xs text-[#57534E]">
              <li>
                <Link to="/interview/hr" className="hover:text-[#E65A3C] transition-colors">
                  Human Resources & Culture
                </Link>
              </li>
              <li>
                <Link to="/interview/technical" className="hover:text-[#E65A3C] transition-colors">
                  Technical & Engineering
                </Link>
              </li>
              <li>
                <Link to="/interview/behavioral" className="hover:text-[#E65A3C] transition-colors">
                  Behavioral & Leadership
                </Link>
              </li>
              <li>
                <Link to="/interview/general" className="hover:text-[#E65A3C] transition-colors">
                  General & Value Proposition
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1C1917] mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-[#57534E]">
              <li>
                <Link to="/how-it-works" className="hover:text-[#E65A3C] transition-colors">
                  How It Works (Architecture)
                </Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-[#E65A3C] transition-colors">
                  Session History
                </Link>
              </li>
              <li>
                <Link to="/report" className="hover:text-[#E65A3C] transition-colors">
                  Assessment Reports
                </Link>
              </li>
              <li>
                <Link to="/practice" className="hover:text-[#E65A3C] transition-colors">
                  Start New Session
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[#EAE5DC] flex flex-col sm:flex-row items-center justify-between text-xs text-[#78716C] gap-4">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} InterviewIQ</span>
            <span aria-hidden="true">·</span>
            <span>All rights reserved</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#1B4332] font-medium">Production-grade client evaluation engine</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[11px] text-[#A8A29E]">Structured for Python/FastAPI backend plug-in</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
