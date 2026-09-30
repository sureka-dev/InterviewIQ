import { NLPEvaluation, Question } from '../types';

export const COMMON_FILLER_WORDS = [
  'um', 'uh', 'like', 'you know', 'basically', 'sort of', 'kind of',
  'honestly', 'actually', 'literally', 'right', 'i mean', 'so yeah',
  'stuff like that', 'and all that'
];

export const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'could', 'did', 'do', 'does', 'doing', 'down', 'during',
  'each', 'few', 'for', 'from', 'further',
  'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how',
  'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself',
  'just', 'me', 'more', 'most', 'my', 'myself',
  'no', 'nor', 'not', 'now', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own',
  'same', 'she', 'should', 'so', 'some', 'such',
  'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too',
  'under', 'until', 'up', 'very',
  'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'would', 'you', 'your', 'yours'
]);

export const SOPHISTICATED_VOCABULARY = new Set([
  'collaborate', 'spearhead', 'implement', 'orchestrate', 'architect', 'streamline',
  'optimize', 'mitigate', 'prioritize', 'quantify', 'accelerate', 'coordinate',
  'articulate', 'navigate', 'synthesize', 'differentiate', 'cultivate', 'leverage',
  'pioneered', 'initiative', 'methodology', 'framework', 'scalable', 'resilient',
  'sustainable', 'holistic', 'pragmatic', 'iterative', 'contingency', 'efficiency',
  'compromise', 'milestone', 'consensus', 'throughput', 'diagnose', 'containment'
]);

/**
 * Perform genuine NLP analysis on candidate's actual answer against question expectations.
 * Computes strictly derived metrics from the candidate's real text.
 */
export function analyzeNLP(text: string, question: Question): NLPEvaluation {
  const cleanText = text.trim();
  if (!cleanText) {
    return {
      relevance: 0,
      clarity: 0,
      vocabulary: 0,
      grammar: 0,
      fillerWordsScore: 0,
      fillerWordsCount: 0,
      fillerWordsList: [],
      detectedKeywords: [],
      missingKeywords: question.expectedKeywords,
      readabilityScore: 0,
      wordCount: 0,
      uniqueWordsRatio: 0,
      avgSentenceLength: 0,
      estimatedSpeakingSeconds: 0
    };
  }

  // Tokenization & word count
  const words = cleanText.toLowerCase().match(/\b[a-z0-9'-]+\b/g) || [];
  const wordCount = words.length;

  if (wordCount === 0) {
    return {
      relevance: 0,
      clarity: 0,
      vocabulary: 0,
      grammar: 0,
      fillerWordsScore: 0,
      fillerWordsCount: 0,
      fillerWordsList: [],
      detectedKeywords: [],
      missingKeywords: question.expectedKeywords,
      readabilityScore: 0,
      wordCount: 0,
      uniqueWordsRatio: 0,
      avgSentenceLength: 0,
      estimatedSpeakingSeconds: 0
    };
  }
  
  // Sentences split by punctuation
  const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceCount = Math.max(sentences.length, 1);
  const avgSentenceLength = Math.round((wordCount / sentenceCount) * 10) / 10;

  // Real Filler words detection
  const lowerText = cleanText.toLowerCase();
  const fillerCounts: { [word: string]: number } = {};
  let totalFillers = 0;

  COMMON_FILLER_WORDS.forEach(filler => {
    const regex = new RegExp(`\\b${filler}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches && matches.length > 0) {
      fillerCounts[filler] = matches.length;
      totalFillers += matches.length;
    }
  });

  const fillerWordsList = Object.entries(fillerCounts).map(([word, count]) => ({ word, count }));
  
  // Filler words score: 100 if 0 fillers, penalizing based on frequency
  const fillerRatio = totalFillers / Math.max(wordCount, 1);
  const fillerWordsScore = Math.max(0, Math.min(100, Math.round(100 - (fillerRatio * 150))));

  // Real Keywords detection
  const detectedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  question.expectedKeywords.forEach(expected => {
    const root = expected.toLowerCase().slice(0, Math.max(4, expected.length - 2));
    const found = words.some(w => w.startsWith(root) || w === expected.toLowerCase());
    if (found) {
      detectedKeywords.push(expected);
    } else {
      missingKeywords.push(expected);
    }
  });

  const keywordCoverageRatio = detectedKeywords.length / Math.max(1, question.expectedKeywords.length);
  
  // Real Relevance: Derived strictly from matched keywords + sufficient substance
  let relevanceScore = Math.round(keywordCoverageRatio * 80);
  if (wordCount >= 60 && wordCount <= 280) {
    relevanceScore += 20;
  } else if (wordCount >= 30) {
    relevanceScore += 10;
  } else if (wordCount < 15) {
    relevanceScore = Math.round(relevanceScore * 0.4);
  }
  relevanceScore = Math.min(100, Math.max(0, relevanceScore));

  // Real Vocabulary & Lexical richness
  const uniqueWords = new Set(words.filter(w => !STOP_WORDS.has(w)));
  const uniqueWordsRatio = wordCount > 0 ? Math.round((uniqueWords.size / wordCount) * 100) : 0;
  const advancedFound = words.filter(w => SOPHISTICATED_VOCABULARY.has(w)).length;
  
  let vocabularyScore = Math.round((uniqueWordsRatio * 0.75) + (advancedFound * 6));
  if (wordCount < 20) vocabularyScore = Math.round(vocabularyScore * 0.5);
  vocabularyScore = Math.min(100, Math.max(0, vocabularyScore));

  // Real Clarity: sentence structure & length balance
  let clarityScore = 80;
  if (avgSentenceLength > 28) {
    clarityScore -= 25; // Run-on
  } else if (avgSentenceLength < 7) {
    clarityScore -= 20; // Fragments
  } else if (avgSentenceLength >= 12 && avgSentenceLength <= 22) {
    clarityScore += 15;
  }
  if (wordCount < 30) clarityScore -= 30;
  clarityScore = Math.min(100, Math.max(0, clarityScore));

  // Real Grammar & Mechanics: sentence capitalization & punctuation
  let grammarScore = 85;
  const capitalizedSentences = sentences.filter(s => /^\s*[A-Z]/.test(s)).length;
  const capitalizationRatio = sentenceCount > 0 ? capitalizedSentences / sentenceCount : 1;
  if (capitalizationRatio < 0.6) grammarScore -= 25;
  else if (capitalizationRatio < 0.8) grammarScore -= 10;
  
  const commaCount = (cleanText.match(/,/g) || []).length;
  if (wordCount > 50 && commaCount === 0) grammarScore -= 10;
  if (wordCount < 20) grammarScore -= 20;
  grammarScore = Math.min(100, Math.max(0, grammarScore));

  // Real Readability
  const syllablesEstimate = words.reduce((acc, word) => acc + Math.max(1, Math.round(word.length / 3)), 0);
  const avgSyllablesPerWord = wordCount > 0 ? syllablesEstimate / wordCount : 1;
  const readabilityRaw = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
  const readabilityScore = Math.min(100, Math.max(0, Math.round(readabilityRaw * 0.8 + 15)));

  // Estimated speaking time (avg conversational pace ~140 words per min)
  const estimatedSpeakingSeconds = Math.round((wordCount / 140) * 60);

  return {
    relevance: relevanceScore,
    clarity: clarityScore,
    vocabulary: vocabularyScore,
    grammar: grammarScore,
    fillerWordsScore,
    fillerWordsCount: totalFillers,
    fillerWordsList,
    detectedKeywords,
    missingKeywords,
    readabilityScore,
    wordCount,
    uniqueWordsRatio,
    avgSentenceLength,
    estimatedSpeakingSeconds
  };
}
