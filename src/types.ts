export type InterviewCategory = 'hr' | 'technical' | 'behavioral' | 'general';

export interface Question {
  id: string;
  category: InterviewCategory;
  categoryName: string;
  roleLevel: 'Entry' | 'Mid' | 'Senior';
  prompt: string;
  context: string;
  expectedKeywords: string[];
  tips: string[];
  starPrompt?: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  sampleIdealAnswer: string;
}

export interface NLPEvaluation {
  relevance: number; // 0 - 100 based on actual keyword coverage
  clarity: number; // 0 - 100 based on sentence structure
  vocabulary: number; // 0 - 100 based on actual unique word ratio & domain terms
  grammar: number; // 0 - 100 based on mechanics & punctuation
  fillerWordsScore: number; // 0 - 100 (100 = 0 filler words)
  fillerWordsCount: number;
  fillerWordsList: { word: string; count: number }[];
  detectedKeywords: string[];
  missingKeywords: string[];
  readabilityScore: number;
  wordCount: number;
  uniqueWordsRatio: number;
  avgSentenceLength: number;
  estimatedSpeakingSeconds: number;
}

export interface ConfidenceEvaluation {
  score: number; // 0 - 100 based on real linguistic assertive vs hesitant markers
  level: 'High' | 'Moderate' | 'Developing';
  assertiveCount: number;
  hesitantCount: number;
  qualifiersCount: number;
  assertivePhrases: string[];
  hesitantPhrases: string[];
  qualifiersDetected: string[];
  summary: string;
}

export interface EmotionEvaluation {
  primaryEmotion: 'Enthusiastic' | 'Poised' | 'Neutral' | 'Hesitant' | 'Anxious';
  sentimentScore: number; // -1.0 to +1.0 calculated from candidate's real words
  breakdown: {
    enthusiastic: number; // percentage
    poised: number;
    neutral: number;
    hesitant: number;
    anxious: number;
  };
  summary: string;
}

export interface CommunicationEvaluation {
  score: number; // 0 - 100
  conciseness: number; // 0 - 100 based on real length
  articulation: number; // 0 - 100 based on real transition connectives
  pacingStatus: 'Optimal' | 'Too Brief' | 'Slightly Wordy' | 'Needs Expansion';
  starStructure: {
    situationDetected: boolean;
    taskDetected: boolean;
    actionDetected: boolean;
    resultDetected: boolean;
    score: number; // 0 - 100
  };
  summary: string;
}

export interface AnswerEvaluation {
  overallScore: number; // 0 - 100 strictly computed from actual metrics
  nlp: NLPEvaluation;
  confidence: ConfidenceEvaluation;
  emotion: EmotionEvaluation;
  communication: CommunicationEvaluation;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  modelAnswerSuggestion?: string;
}

export interface VideoAnalysisCapabilities {
  videoRecorded: boolean;
  videoDurationSeconds: number;
  speechTranscribed: boolean;
  browserSpeechRecognitionAvailable: boolean;
  // Clear labeling for future Python/FastAPI computer vision backend
  facialEmotionStatus: 'Coming Soon (Python/FastAPI Backend Pipeline)' | 'Processed' | 'Unavailable';
  voicePitchConfidenceStatus: 'Coming Soon (Python/FastAPI Backend Pipeline)' | 'Processed' | 'Unavailable';
  eyeContactStatus: 'Coming Soon (Python/FastAPI Backend Pipeline)' | 'Processed' | 'Unavailable';
  postureStatus: 'Coming Soon (Python/FastAPI Backend Pipeline)' | 'Processed' | 'Unavailable';
}

export interface QuestionAnswerRecord {
  questionId: string;
  questionPrompt: string;
  category: InterviewCategory;
  userAnswer: string;
  timeSpentSeconds: number;
  evaluation: AnswerEvaluation;
  hasVideoRecording?: boolean;
  videoBlobUrl?: string;
  speechRecognitionUsed?: boolean;
  videoAnalysis?: VideoAnalysisCapabilities;
}

export interface InterviewSession {
  id: string;
  category: InterviewCategory;
  categoryName: string;
  timestamp: number;
  dateFormatted: string;
  durationSeconds: number;
  overallScore: number;
  answers: QuestionAnswerRecord[];
  aggregatedEvaluation: AnswerEvaluation;
  hasVideoRecordings?: boolean;
}
