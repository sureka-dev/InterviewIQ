import { CommunicationEvaluation } from '../types';

const TRANSITION_MARKERS = [
  'for example', 'specifically', 'in particular', 'firstly', 'secondly',
  'as a result', 'consequently', 'furthermore', 'in addition', 'on the other hand',
  'ultimately', 'in conclusion', 'to illustrate', 'therefore', 'because of this'
];

const SITUATION_TRIGGERS = [
  'when i was', 'in my previous role', 'at my current company', 'during my time',
  'our team was facing', 'we were tasked with', 'the situation was', 'at the time',
  'in a recent project', 'on one occasion'
];

const TASK_TRIGGERS = [
  'my responsibility was', 'my objective was', 'i needed to', 'the goal was',
  'my role was', 'we had to', 'i was tasked with', 'i had to'
];

const ACTION_TRIGGERS = [
  'i initiated', 'i reached out', 'i organized', 'i built', 'i implemented',
  'i redesigned', 'i analyzed', 'i scheduled', 'i drove', 'my approach was',
  'i created', 'i coordinated', 'i led the effort'
];

const RESULT_TRIGGERS = [
  'as a result', 'the outcome was', 'which led to', 'we achieved', 'increased by',
  'reduced by', 'improved', 'successfully delivered', 'resulting in', 'the impact was',
  'which decreased', 'which boosted'
];

export function analyzeCommunication(text: string): CommunicationEvaluation {
  const clean = text.toLowerCase().trim();
  const words = clean.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  if (wordCount === 0) {
    return {
      score: 0,
      conciseness: 0,
      articulation: 0,
      pacingStatus: 'Needs Expansion',
      starStructure: {
        situationDetected: false,
        taskDetected: false,
        actionDetected: false,
        resultDetected: false,
        score: 0
      },
      summary: 'No answer recorded yet.'
    };
  }

  // Conciseness scoring based on real length: Target sweet spot 110-230 words
  let conciseness = 70;
  if (wordCount < 30) {
    conciseness = Math.round((wordCount / 30) * 40);
  } else if (wordCount < 80) {
    conciseness = Math.round(40 + ((wordCount - 30) / 50) * 40);
  } else if (wordCount >= 100 && wordCount <= 240) {
    conciseness = 95;
  } else if (wordCount > 300) {
    conciseness = Math.max(30, 95 - Math.round((wordCount - 300) / 6));
  }

  // Pacing status derived from candidate's real word count
  let pacingStatus: 'Optimal' | 'Too Brief' | 'Slightly Wordy' | 'Needs Expansion' = 'Optimal';
  if (wordCount < 40) {
    pacingStatus = 'Needs Expansion';
  } else if (wordCount < 85) {
    pacingStatus = 'Too Brief';
  } else if (wordCount > 290) {
    pacingStatus = 'Slightly Wordy';
  } else {
    pacingStatus = 'Optimal';
  }

  // Articulation based on actual transition connectors
  let transitionsCount = 0;
  TRANSITION_MARKERS.forEach(marker => {
    if (clean.includes(marker)) transitionsCount++;
  });
  let articulation = Math.round(50 + (transitionsCount * 12));
  if (wordCount < 30) articulation = Math.min(articulation, 40);
  articulation = Math.min(100, Math.max(10, articulation));

  // Genuine STAR Structure detection
  const situationDetected = SITUATION_TRIGGERS.some(t => clean.includes(t)) || /in (20\d\d|my previous|our last|a project)/i.test(clean);
  const taskDetected = TASK_TRIGGERS.some(t => clean.includes(t)) || /goal was|responsible for|target was|assignment was/i.test(clean);
  const actionDetected = ACTION_TRIGGERS.some(t => clean.includes(t)) || /i decided to|i took|i created|i coordinated|i wrote/i.test(clean);
  const resultDetected = RESULT_TRIGGERS.some(t => clean.includes(t)) || /\b(\d+%\b|\$\d+|\d+ weeks|\d+ days|metrics|outcome|delivered)/i.test(clean);

  const starComponentsFound = [situationDetected, taskDetected, actionDetected, resultDetected].filter(Boolean).length;
  const starScore = Math.round((starComponentsFound / 4) * 100);

  // Overall communication score
  const score = Math.round((conciseness * 0.35) + (articulation * 0.35) + (starScore * 0.3));

  let summary = '';
  if (starComponentsFound === 4) {
    summary = 'Outstanding STAR structure. Your spoken answer clearly connected context, action, and measurable outcomes.';
  } else if (starComponentsFound >= 2) {
    summary = `Good narrative flow (${starComponentsFound}/4 STAR elements detected). Adding explicit quantitative results will sharpen the ending.`;
  } else {
    summary = 'Answer lacked structured STAR markers. Frame your response with clear Situation, Task, Action, and Result components.';
  }

  return {
    score,
    conciseness,
    articulation,
    pacingStatus,
    starStructure: {
      situationDetected,
      taskDetected,
      actionDetected,
      resultDetected,
      score: starScore
    },
    summary
  };
}
