import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  History, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Trash2, 
  FileText, 
  Plus, 
  Users,
  Cpu,
  Compass,
  Award,
  Film
} from 'lucide-react';
import { Button } from '../components/Button';
import { EmptyStateGraphic } from '../components/EmptyStateGraphic';
import { getInterviewSessions, deleteInterviewSession, clearAllSessions } from '../lib/storage';
import { InterviewSession, InterviewCategory } from '../types';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<InterviewSession[]>([]);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = () => {
    setSessions(getInterviewSessions());
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this completed interview record?')) {
      deleteInterviewSession(id);
      loadSessions();
    }
  };

  const handleClearAll = () => {
    if (confirm('Clear all interview history records?')) {
      clearAllSessions();
      loadSessions();
    }
  };

  const getCategoryIcon = (cat: InterviewCategory) => {
    switch (cat) {
      case 'hr':
        return <Users className="w-5 h-5 text-[#E65A3C]" />;
      case 'technical':
        return <Cpu className="w-5 h-5 text-[#1B4332]" />;
      case 'behavioral':
        return <Compass className="w-5 h-5 text-[#B45309]" />;
      case 'general':
        return <Award className="w-5 h-5 text-[#3F3F46]" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-[#E7E2DA] gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#E65A3C]">
            Historical Records
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#1C1917] mt-1">
            Interview History
          </h1>
          <p className="text-xs text-[#78716C] mt-1">
            Persisted locally in your browser. Contains only interviews you actually recorded and completed.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {sessions.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs text-[#78716C] hover:text-rose-600 transition-colors px-2 py-1"
            >
              Clear All Records
            </button>
          )}
          <Link to="/practice">
            <Button size="sm" variant="primary" icon={<Plus className="w-3.5 h-3.5" />}>
              Start New Interview
            </Button>
          </Link>
        </div>
      </div>

      {/* Required Empty State if no real interviews have been completed */}
      {sessions.length === 0 ? (
        <div className="p-12 md:p-16 rounded-2xl bg-white border border-[#E7E2DA] shadow-xs text-center max-w-xl mx-auto space-y-4 animate-fade-in">
          <EmptyStateGraphic variant="interview" className="w-28 h-28 mx-auto" />
          <h3 className="font-serif text-2xl font-bold text-[#1C1917]">
            No interviews completed yet.
          </h3>
          <p className="text-sm text-[#57534E] leading-relaxed">
            Complete an interview to receive your personalized feedback and see your interview history.
          </p>
          <div className="pt-2">
            <Link to="/practice">
              <Button size="md" variant="primary" icon={<ArrowRight className="w-4 h-4" />}>
                Start Your First Interview
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        /* Real Sessions List */
        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              onClick={() => navigate(`/report?sessionId=${session.id}`)}
              className="group p-6 rounded-2xl bg-white border border-[#E7E2DA] hover:border-[#CDC5B8] shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-6"
            >
              {/* Left Details */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#ECE7DF] group-hover:scale-105 transition-transform shrink-0">
                  {getCategoryIcon(session.category)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg font-bold text-[#1C1917] group-hover:text-[#E65A3C] transition-colors">
                      {session.categoryName} Interview
                    </h3>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#EAE5DC] text-[#57534E]">
                      {session.answers.length} {session.answers.length === 1 ? 'Prompt' : 'Prompts'}
                    </span>
                    {session.hasVideoRecordings && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Film className="w-3 h-3" />
                        Video
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#78716C] mt-1.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#A8A29E]" />
                      {session.dateFormatted}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#A8A29E]" />
                      {session.durationSeconds > 0 ? `${Math.round(session.durationSeconds)}s duration` : '< 1 min'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#1B4332] font-medium">
                      Tone: {session.aggregatedEvaluation.emotion.primaryEmotion}
                    </span>
                  </div>

                  {/* Transcript snippet */}
                  {session.answers[0] && session.answers[0].userAnswer && (
                    <p className="mt-2 text-xs text-[#57534E] line-clamp-1 italic max-w-lg">
                      "{session.answers[0].userAnswer}"
                    </p>
                  )}
                </div>
              </div>

              {/* Right Scores & Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#F5F2EC]">
                <div className="text-left sm:text-right">
                  <span className="text-[11px] uppercase tracking-wider text-[#78716C] block">
                    Calculated Score
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-serif text-2xl font-bold text-[#1C1917] tabular-nums">
                      {session.overallScore}
                    </span>
                    <span className="text-xs text-[#78716C]">/ 100</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    icon={<FileText className="w-3.5 h-3.5" />}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/report?sessionId=${session.id}`);
                    }}
                  >
                    View Report
                  </Button>
                  <button
                    onClick={(e) => handleDelete(session.id, e)}
                    className="p-2 rounded-lg text-[#A8A29E] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete session record"
                    aria-label="Delete session"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
