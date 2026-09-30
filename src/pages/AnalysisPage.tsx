import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  Award, 
  Brain, 
  ShieldCheck, 
  Smile, 
  MessageSquare, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  FileText, 
  ArrowRight, 
  RotateCcw,
  BookOpen,
  Film,
  Camera,
  Clock,
  AlertCircle
} from 'lucide-react';
import { ScoreRing } from '../components/ScoreRing';
import { ScoreBar } from '../components/ScoreBar';
import { RadarChart, RadarDataPoint } from '../components/RadarChart';
import { EmotionMeter } from '../components/EmotionMeter';
import { AnalysisCard } from '../components/AnalysisCard';
import { EmptyStateGraphic } from '../components/EmptyStateGraphic';
import { Button } from '../components/Button';
import { getInterviewSessionById, getInterviewSessions } from '../lib/storage';
import { getRecordedVideoBlob } from '../lib/videoStorage';
import { InterviewSession } from '../types';

export const AnalysisPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('sessionId');

  const [session, setSession] = useState<InterviewSession | null>(null);
  const [videoUrls, setVideoUrls] = useState<{ [qId: string]: string }>({});

  useEffect(() => {
    let targetSession: InterviewSession | null = null;
    if (sessionId) {
      targetSession = getInterviewSessionById(sessionId);
    }

    if (!targetSession) {
      const allSessions = getInterviewSessions();
      if (allSessions.length > 0) {
        targetSession = allSessions[0];
      }
    }

    setSession(targetSession);

    // If session has answers, attempt to load recorded videos from IndexedDB
    if (targetSession) {
      targetSession.answers.forEach(async (ans) => {
        if (ans.hasVideoRecording) {
          const blob = await getRecordedVideoBlob(`video_${ans.questionId}`);
          if (blob) {
            const url = URL.createObjectURL(blob);
            setVideoUrls(prev => ({ ...prev, [ans.questionId]: url }));
          }
        }
      });
    }
  }, [sessionId]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(videoUrls).forEach(url => URL.revokeObjectURL(url));
    };
  }, [videoUrls]);

  // Pure Empty State when no real interview has been completed
  if (!session) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-5 animate-fade-in">
        <EmptyStateGraphic variant="interview" className="w-28 h-28 mx-auto" />
        <h2 className="font-serif text-3xl font-bold text-[#1C1917]">
          Your analysis will appear here.
        </h2>
        <p className="text-sm text-[#57534E] max-w-md mx-auto leading-relaxed">
          Complete an interview to receive your personalized feedback.
        </p>
        <div className="pt-2">
          <Link to="/practice">
            <Button size="lg" variant="primary" icon={<ArrowRight className="w-4 h-4" />}>
              Start Your First Interview
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const evalData = session.aggregatedEvaluation;

  // Radar chart data points strictly from real calculations
  const radarData: RadarDataPoint[] = [
    { dimension: 'Relevance', value: evalData.nlp.relevance },
    { dimension: 'Clarity', value: evalData.nlp.clarity },
    { dimension: 'Vocabulary', value: evalData.nlp.vocabulary },
    { dimension: 'Confidence', value: evalData.confidence.score },
    { dimension: 'Structure', value: evalData.communication.score },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-10">
      
      {/* Page Title & Navigation Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-[#E7E2DA] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#78716C]">
            <span className="font-semibold text-[#E65A3C] uppercase tracking-wider">
              {session.categoryName} Track
            </span>
            <span aria-hidden="true">·</span>
            <span>Recorded {session.dateFormatted}</span>
            <span aria-hidden="true">·</span>
            <span>{session.answers.length} {session.answers.length === 1 ? 'Prompt' : 'Prompts'} Completed</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917] mt-1.5">
            Linguistic & Poise Assessment
          </h1>
          <p className="text-xs text-[#57534E] mt-1">
            Calculated strictly from your actual interview speech-to-text transcript and response pacing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to={`/report?sessionId=${session.id}`}>
            <Button size="md" variant="primary" icon={<FileText className="w-4 h-4" />}>
              View Full Report
            </Button>
          </Link>
          <Link to="/practice">
            <Button size="md" variant="outline" icon={<RotateCcw className="w-4 h-4" />}>
              Practice Again
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary KPI Row: Real Overall Score Ring + Radar Chart + Executive Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Overall Score Ring & Real Grade Tier (Col 4) */}
        <div className="lg:col-span-4 p-8 rounded-2xl bg-white border border-[#E7E2DA] shadow-xs flex flex-col items-center justify-between text-center">
          <div className="w-full">
            <span className="text-xs uppercase tracking-wider text-[#78716C] font-semibold block mb-4">
              Real Composite Benchmark Score
            </span>
            <ScoreRing
              score={evalData.overallScore}
              size={144}
              strokeWidth={10}
              showGrade={true}
              colorScheme="auto"
            />
          </div>

          <div className="mt-6 pt-6 border-t border-[#F0ECE4] w-full text-left space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#78716C]">Poise Tier:</span>
              <span className="font-semibold text-[#1C1917]">{evalData.confidence.level}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#78716C]">Linguistic Tone:</span>
              <span className="font-semibold text-[#E65A3C]">{evalData.emotion.primaryEmotion}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#78716C]">Communication:</span>
              <span className="font-semibold text-[#1B4332]">{evalData.communication.score}% Score</span>
            </div>
          </div>
        </div>

        {/* 5-Axis Radar Chart from Real Values (Col 5) */}
        <div className="lg:col-span-5 p-8 rounded-2xl bg-white border border-[#E7E2DA] shadow-xs flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between mb-2">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#78716C] font-semibold block">
                Calculated Dimensions
              </span>
              <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                Competency Radar
              </h3>
            </div>
            <span className="text-[11px] font-mono text-[#78716C] bg-[#FAF8F5] border border-[#EAE5DC] px-2 py-0.5 rounded">
              Actual Output
            </span>
          </div>

          <div className="py-2">
            <RadarChart data={radarData} size={250} />
          </div>

          <p className="text-xs text-[#78716C] text-center mt-2">
            Plotted directly from your spoken words, sentence length, and vocabulary breadth.
          </p>
        </div>

        {/* Executive Summary Card (Col 3) */}
        <div className="lg:col-span-3 p-6 rounded-2xl bg-[#FAF8F5] border border-[#ECE7DF] flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#E65A3C] font-semibold block mb-1">
              Summary Diagnosis
            </span>
            <h3 className="font-serif text-lg font-bold text-[#1C1917]">
              Evaluator Findings
            </h3>
            <p className="text-xs text-[#57534E] leading-relaxed mt-3">
              {evalData.confidence.summary}
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t border-[#E8E2D7] text-xs">
            <div className="flex items-center gap-2 text-[#1B4332]">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{evalData.nlp.detectedKeywords.length} Expected terms matched</span>
            </div>
            <div className="flex items-center gap-2 text-[#1B4332]">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{evalData.nlp.fillerWordsCount} Distracting fillers detected</span>
            </div>
          </div>
        </div>

      </div>

      {/* Recorded Video Playback Section (If user recorded video) */}
      {session.answers.some(a => a.hasVideoRecording) && (
        <div className="p-6 md:p-8 rounded-2xl bg-white border border-[#E7E2DA] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE4]">
            <div className="flex items-center gap-2">
              <Film className="w-5 h-5 text-[#E65A3C]" />
              <h3 className="font-serif text-xl font-bold text-[#1C1917]">
                Recorded Video Playback
              </h3>
            </div>
            <span className="text-xs font-mono text-[#1B4332] bg-[#E8F2EC] px-3 py-1 rounded-md">
              Candidate Webcam Stream Captured
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {session.answers.map((ans, idx) => (
              <div key={ans.questionId} className="space-y-2">
                <span className="text-xs font-semibold text-[#1C1917] block">
                  Question {idx + 1}: "{ans.questionPrompt}"
                </span>
                {videoUrls[ans.questionId] ? (
                  <video
                    src={videoUrls[ans.questionId]}
                    controls
                    className="w-full rounded-xl bg-black max-h-[260px] object-cover border border-[#E7E2DA]"
                  />
                ) : (
                  <div className="p-8 text-center bg-[#FAF8F5] rounded-xl border border-[#ECE7DF] text-xs text-[#78716C]">
                    Video recorded in session ({ans.timeSpentSeconds}s duration).
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Analytical Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* NLP Breakdown Card */}
        <AnalysisCard
          title="NLP Answer Breakdown"
          subtitle="Directly measured from your spoken transcript"
          icon={<Brain className="w-5 h-5 text-[#E65A3C]" />}
        >
          <div className="space-y-4 mt-2">
            <ScoreBar
              label="Relevance to Question"
              value={evalData.nlp.relevance}
              secondaryText={`${evalData.nlp.detectedKeywords.length} concepts matched`}
            />
            <ScoreBar
              label="Clarity & Sentence Cadence"
              value={evalData.nlp.clarity}
              secondaryText={`${evalData.nlp.avgSentenceLength} words/sentence`}
            />
            <ScoreBar
              label="Vocabulary & Lexical Richness"
              value={evalData.nlp.vocabulary}
              secondaryText={`${evalData.nlp.uniqueWordsRatio}% unique terms`}
            />
            <ScoreBar
              label="Grammar & Mechanics"
              value={evalData.nlp.grammar}
            />
            <ScoreBar
              label="Verbal Discipline (No Fillers)"
              value={evalData.nlp.fillerWordsScore}
              secondaryText={`${evalData.nlp.fillerWordsCount} filler pauses`}
            />

            <div className="pt-3 border-t border-[#F0ECE4] text-xs text-[#57534E] flex items-center justify-between">
              <span>Total Words Spoken: <strong className="text-[#1C1917]">{evalData.nlp.wordCount}</strong></span>
              <span>Estimated Duration: <strong className="text-[#1C1917]">{evalData.nlp.estimatedSpeakingSeconds}s</strong></span>
            </div>
          </div>
        </AnalysisCard>

        {/* Emotion & Tone Meter Card */}
        <AnalysisCard
          title="Emotion & Delivery Sentiment"
          subtitle="Derived from emotional lexicon markers in your actual response"
          icon={<Smile className="w-5 h-5 text-[#1B4332]" />}
        >
          <div className="mt-2">
            <EmotionMeter emotion={evalData.emotion} />
          </div>
        </AnalysisCard>

        {/* Confidence & Conviction Card */}
        <AnalysisCard
          title="Confidence & Assertiveness"
          subtitle="Active ownership statements vs. hesitant qualifiers"
          icon={<ShieldCheck className="w-5 h-5 text-[#B45309]" />}
        >
          <div className="space-y-4 mt-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] border border-[#ECE7DF]">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#78716C] block">
                  Delivery Poise
                </span>
                <span className="font-serif text-lg font-bold text-[#1C1917]">
                  {evalData.confidence.level} Poise ({evalData.confidence.score}/100)
                </span>
              </div>
              <span className="font-mono text-sm font-bold text-[#1B4332] bg-[#E8F2EC] px-3 py-1 rounded-lg">
                {evalData.confidence.assertiveCount} Assertive Statement(s)
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <span className="text-[#78716C] block font-medium">Assertive Statements Found:</span>
              <div className="flex flex-wrap gap-1.5">
                {evalData.confidence.assertivePhrases.length > 0 ? (
                  evalData.confidence.assertivePhrases.map((phrase, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#E7E2DA] text-[#1C1917] font-mono text-[11px]">
                      "{phrase}"
                    </span>
                  ))
                ) : (
                  <span className="text-[#78716C] italic">None identified in this answer</span>
                )}
              </div>
            </div>

            <p className="text-xs text-[#57534E] leading-relaxed pt-2 border-t border-[#F0ECE4]">
              {evalData.confidence.summary}
            </p>
          </div>
        </AnalysisCard>

        {/* Communication & STAR Structure Card */}
        <AnalysisCard
          title="Communication & STAR Structure"
          subtitle="Story framework components detected in your transcript"
          icon={<MessageSquare className="w-5 h-5 text-[#1C1917]" />}
        >
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className={`p-2.5 rounded-lg border ${
                evalData.communication.starStructure.situationDetected
                  ? 'border-[#C5DED0] bg-[#EFF6F2] text-[#1B4332]'
                  : 'border-[#ECE7DF] bg-[#FAF8F5] text-[#A8A29E]'
              }`}>
                <span className="font-bold block">S</span>
                <span className="text-[10px]">Situation</span>
              </div>
              <div className={`p-2.5 rounded-lg border ${
                evalData.communication.starStructure.taskDetected
                  ? 'border-[#C5DED0] bg-[#EFF6F2] text-[#1B4332]'
                  : 'border-[#ECE7DF] bg-[#FAF8F5] text-[#A8A29E]'
              }`}>
                <span className="font-bold block">T</span>
                <span className="text-[10px]">Task</span>
              </div>
              <div className={`p-2.5 rounded-lg border ${
                evalData.communication.starStructure.actionDetected
                  ? 'border-[#C5DED0] bg-[#EFF6F2] text-[#1B4332]'
                  : 'border-[#ECE7DF] bg-[#FAF8F5] text-[#A8A29E]'
              }`}>
                <span className="font-bold block">A</span>
                <span className="text-[10px]">Action</span>
              </div>
              <div className={`p-2.5 rounded-lg border ${
                evalData.communication.starStructure.resultDetected
                  ? 'border-[#C5DED0] bg-[#EFF6F2] text-[#1B4332]'
                  : 'border-[#ECE7DF] bg-[#FAF8F5] text-[#A8A29E]'
              }`}>
                <span className="font-bold block">R</span>
                <span className="text-[10px]">Result</span>
              </div>
            </div>

            <ScoreBar label="Conciseness" value={evalData.communication.conciseness} />
            <ScoreBar label="Articulation & Flow" value={evalData.communication.articulation} />

            <p className="text-xs text-[#57534E] leading-relaxed pt-2 border-t border-[#F0ECE4]">
              {evalData.communication.summary}
            </p>
          </div>
        </AnalysisCard>

      </div>

      {/* Future Python/FastAPI Backend Capabilities (Clearly Labeled Coming Soon) */}
      <div className="p-6 md:p-8 rounded-2xl bg-[#FAF8F5] border border-[#ECE7DF] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E2DDD5] gap-2">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#E65A3C] font-semibold block">
              Backend Video Processing Pipeline
            </span>
            <h3 className="font-serif text-lg font-bold text-[#1C1917]">
              Computer Vision & Audio ML Analytics
            </h3>
          </div>
          <span className="text-xs font-mono text-[#B45309] bg-[#FEF3C7] border border-[#FDE68A] px-2.5 py-1 rounded-md font-medium">
            Python/FastAPI Service — Architecture Ready
          </span>
        </div>

        <p className="text-xs text-[#57534E] leading-relaxed">
          InterviewIQ processes speech transcript and linguistic features client-side. The captured video stream is staged to connect with our Python/FastAPI backend for high-frequency computer vision and acoustic models:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-white rounded-xl border border-[#E7E2DA]">
            <strong className="block text-[#1C1917] mb-1">Facial Micro-Expressions</strong>
            <span className="text-[11px] text-[#B45309] bg-[#FEF3C7] px-2 py-0.5 rounded font-medium inline-block mb-1">
              Not available yet
            </span>
            <p className="text-[11px] text-[#78716C]">Micro-expression classification via FER models.</p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-[#E7E2DA]">
            <strong className="block text-[#1C1917] mb-1">Acoustic Pitch & Jitter</strong>
            <span className="text-[11px] text-[#B45309] bg-[#FEF3C7] px-2 py-0.5 rounded font-medium inline-block mb-1">
              Not available yet
            </span>
            <p className="text-[11px] text-[#78716C]">Fundamental frequency (F0) & vocal jitter extraction.</p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-[#E7E2DA]">
            <strong className="block text-[#1C1917] mb-1">Eye-Contact Estimation</strong>
            <span className="text-[11px] text-[#B45309] bg-[#FEF3C7] px-2 py-0.5 rounded font-medium inline-block mb-1">
              Not available yet
            </span>
            <p className="text-[11px] text-[#78716C]">Iris gaze vector tracking to measure camera focus.</p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-[#E7E2DA]">
            <strong className="block text-[#1C1917] mb-1">Posture & Head Movement</strong>
            <span className="text-[11px] text-[#B45309] bg-[#FEF3C7] px-2 py-0.5 rounded font-medium inline-block mb-1">
              Not available yet
            </span>
            <p className="text-[11px] text-[#78716C]">Upper-body skeletal keypoint stability via MediaPipe.</p>
          </div>
        </div>
      </div>

      {/* Actionable Qualitative Insights: Strengths, Weaknesses, Suggestions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Strengths */}
        <div className="p-6 rounded-2xl bg-white border border-[#E7E2DA] shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-[#1B4332]">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <h3 className="font-serif text-lg font-bold text-[#1C1917]">
              Demonstrated Strengths
            </h3>
          </div>
          {evalData.strengths.length > 0 ? (
            <ul className="space-y-2 text-xs text-[#57534E]">
              {evalData.strengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#1B4332] font-bold">✓</span>
                  <span className="leading-relaxed">{str}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[#78716C] italic">Complete a longer answer to highlight specific strengths.</p>
          )}
        </div>

        {/* Weaknesses */}
        <div className="p-6 rounded-2xl bg-white border border-[#E7E2DA] shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-[#B45309]">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <h3 className="font-serif text-lg font-bold text-[#1C1917]">
              Identified Blind Spots
            </h3>
          </div>
          <ul className="space-y-2 text-xs text-[#57534E]">
            {evalData.weaknesses.map((w, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#B45309] font-bold">!</span>
                <span className="leading-relaxed">{w}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Suggestions */}
        <div className="p-6 rounded-2xl bg-white border border-[#E7E2DA] shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-[#E65A3C]">
            <Sparkles className="w-5 h-5 shrink-0" />
            <h3 className="font-serif text-lg font-bold text-[#1C1917]">
              Action Plan
            </h3>
          </div>
          <ul className="space-y-2 text-xs text-[#57534E]">
            {evalData.suggestions.map((sug, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#E65A3C] font-bold">→</span>
                <span className="leading-relaxed">{sug}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Transcript & Benchmark Reference */}
      {session.answers.length > 0 && (
        <div className="p-8 rounded-2xl bg-white border border-[#E7E2DA] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE4]">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#E65A3C]" />
              <h3 className="font-serif text-xl font-bold text-[#1C1917]">
                Actual Answer Transcript & Model Comparison
              </h3>
            </div>
            <span className="text-xs font-semibold text-[#1B4332] bg-[#E8F2EC] px-3 py-1 rounded-md">
              Question 1
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#ECE7DF] space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#78716C] block">
                Your Actual Spoken Transcript
              </span>
              <p className="text-xs text-[#1C1917] leading-relaxed italic">
                "{session.answers[0].userAnswer}"
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#EFF6F2] border border-[#C5DED0] space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1B4332] block">
                Target Model Answer for this Prompt
              </span>
              <p className="text-xs text-[#1C1917] leading-relaxed">
                "{session.answers[0].evaluation.modelAnswerSuggestion}"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom CTA Bar */}
      <div className="p-6 rounded-2xl bg-[#1C1917] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-serif text-xl font-bold">
            Export Candidate Assessment Report
          </h4>
          <p className="text-neutral-400 text-xs mt-1">
            Print or download your official report generated from this real interview session.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to={`/report?sessionId=${session.id}`}>
            <Button size="md" variant="primary">
              View Official Report
            </Button>
          </Link>
          <Link to="/history">
            <Button size="md" variant="outline" className="border-neutral-700 bg-neutral-800 text-white hover:bg-neutral-700">
              View History
            </Button>
          </Link>
        </div>
      </div>

    </div>
  );
};
