import { 
  AnswerEvaluation, 
  CommunicationEvaluation, 
  ConfidenceEvaluation, 
  EmotionEvaluation, 
  NLPEvaluation, 
  Question 
} from '../types';
import { analyzeNLP } from './nlp';
import { analyzeConfidence } from './confidence';
import { analyzeEmotion } from './emotion';
import { analyzeCommunication } from './communication';

export function evaluateAnswer(text: string, question: Question): AnswerEvaluation {
  const clean = text.trim();
  
  if (!clean) {
    const emptyNLP = analyzeNLP('', question);
    const emptyConf = analyzeConfidence('');
    const emptyEmo = analyzeEmotion('');
    const emptyComm = analyzeCommunication('');

    return {
      overallScore: 0,
      nlp: emptyNLP,
      confidence: emptyConf,
      emotion: emptyEmo,
      communication: emptyComm,
      strengths: [],
      weaknesses: ['No answer recorded yet.'],
      suggestions: ['Record with camera and microphone or type your response to generate an objective analysis.']
    };
  }

  const nlp = analyzeNLP(clean, question);
  const confidence = analyzeConfidence(clean);
  const emotion = analyzeEmotion(clean);
  const communication = analyzeCommunication(clean);

  // Overall Score weighted formula calculated strictly from real dimensions:
  // NLP (Relevance 40%, Clarity 25%, Vocabulary 20%, Filler Words 15%) = 55%
  // Confidence = 22%
  // Communication = 23%
  const nlpComposite = (nlp.relevance * 0.4) + (nlp.clarity * 0.25) + (nlp.vocabulary * 0.2) + (nlp.fillerWordsScore * 0.15);
  
  const overallScore = Math.min(100, Math.max(0, Math.round(
    (nlpComposite * 0.55) + 
    (confidence.score * 0.22) + 
    (communication.score * 0.23)
  )));

  // Derive genuine Strengths from user's actual metrics
  const strengths: string[] = [];
  if (nlp.relevance >= 75) {
    strengths.push(`High question relevance, covering key terms (${nlp.detectedKeywords.slice(0, 3).join(', ')}).`);
  }
  if (nlp.fillerWordsCount === 0 && nlp.wordCount >= 20) {
    strengths.push('Flawless verbal discipline with zero filler words detected in your answer.');
  } else if (nlp.fillerWordsScore >= 85) {
    strengths.push(`Good verbal discipline with minimal fillers (${nlp.fillerWordsCount} detected).`);
  }
  if (confidence.score >= 80) {
    strengths.push(`Authoritative delivery using ${confidence.assertiveCount} active ownership statement(s).`);
  }
  if (nlp.vocabulary >= 75) {
    strengths.push(`Lexically diverse vocabulary with ${nlp.uniqueWordsRatio}% unique terms.`);
  }
  if (communication.starStructure.resultDetected) {
    strengths.push('Concluded response by explicitly addressing measurable outcomes or results.');
  }
  if (communication.pacingStatus === 'Optimal') {
    strengths.push(`Concise, well-paced spoken length (${nlp.wordCount} words, ~${nlp.estimatedSpeakingSeconds}s).`);
  }

  // Derive genuine Weaknesses from user's actual shortcomings
  const weaknesses: string[] = [];
  if (nlp.wordCount < 40) {
    weaknesses.push(`Answer was brief (${nlp.wordCount} words). A comprehensive interview answer typically spans 120–220 words.`);
  } else if (nlp.wordCount > 300) {
    weaknesses.push(`Answer was long (${nlp.wordCount} words). Try to tighten background detail to avoid diluting key outcomes.`);
  }
  if (nlp.fillerWordsCount > 2) {
    const topFillers = nlp.fillerWordsList.map(f => `"${f.word}" (${f.count}x)`).join(', ');
    weaknesses.push(`Frequent filler word pauses: ${topFillers}.`);
  }
  if (nlp.missingKeywords.length > 2) {
    weaknesses.push(`Omitted expected thematic concepts: ${nlp.missingKeywords.slice(0, 3).join(', ')}.`);
  }
  if (confidence.hesitantCount > 0 || confidence.qualifiersCount > 1) {
    weaknesses.push(`Hedging or tentative clauses detected (${confidence.hesitantPhrases.concat(confidence.qualifiersDetected).slice(0, 3).join(', ')}).`);
  }
  if (!communication.starStructure.resultDetected && nlp.wordCount >= 30) {
    weaknesses.push('Missing explicit quantitative or qualitative result to substantiate the action.');
  }

  // Fallbacks if perfectly clean or short
  if (strengths.length === 0 && nlp.wordCount >= 15) {
    strengths.push('Clear baseline attempt addressing the prompt.');
  }
  if (weaknesses.length === 0 && nlp.wordCount >= 50) {
    weaknesses.push('Minor opportunity to polish transition cadence between actions.');
  }

  // Derive actionable suggestions based on actual performance
  const suggestions: string[] = [];
  if (nlp.missingKeywords.length > 0) {
    suggestions.push(`Naturally weave in key domain terms such as "${nlp.missingKeywords.slice(0, 2).join('", "')}".`);
  }
  if (nlp.fillerWordsCount > 0) {
    suggestions.push('Practice silent pausing instead of vocalizing filler words like "um" or "like".');
  }
  if (!communication.starStructure.resultDetected) {
    suggestions.push('Anchor the conclusion with the "R" in STAR: "As a result, we achieved/improved..."');
  }
  if (confidence.score < 75) {
    suggestions.push('Replace passive constructions ("I was part of") with direct ownership ("I spearheaded", "I designed").');
  }
  suggestions.push(question.tips[0] || 'Keep the initial situation brief and spend 60% of your time on concrete actions and results.');

  return {
    overallScore,
    nlp,
    confidence,
    emotion,
    communication,
    strengths,
    weaknesses,
    suggestions,
    modelAnswerSuggestion: question.sampleIdealAnswer
  };
}

export function aggregateEvaluations(evaluations: AnswerEvaluation[]): AnswerEvaluation {
  if (evaluations.length === 0) {
    throw new Error('Cannot aggregate empty evaluations');
  }

  const count = evaluations.length;
  const avg = (arr: number[]) => Math.round(arr.reduce((a, b) => a + b, 0) / Math.max(arr.length, 1));

  const overallScore = avg(evaluations.map(e => e.overallScore));

  const nlp: NLPEvaluation = {
    relevance: avg(evaluations.map(e => e.nlp.relevance)),
    clarity: avg(evaluations.map(e => e.nlp.clarity)),
    vocabulary: avg(evaluations.map(e => e.nlp.vocabulary)),
    grammar: avg(evaluations.map(e => e.nlp.grammar)),
    fillerWordsScore: avg(evaluations.map(e => e.nlp.fillerWordsScore)),
    fillerWordsCount: evaluations.reduce((sum, e) => sum + e.nlp.fillerWordsCount, 0),
    fillerWordsList: [],
    detectedKeywords: Array.from(new Set(evaluations.flatMap(e => e.nlp.detectedKeywords))),
    missingKeywords: Array.from(new Set(evaluations.flatMap(e => e.nlp.missingKeywords))),
    readabilityScore: avg(evaluations.map(e => e.nlp.readabilityScore)),
    wordCount: evaluations.reduce((sum, e) => sum + e.nlp.wordCount, 0),
    uniqueWordsRatio: avg(evaluations.map(e => e.nlp.uniqueWordsRatio)),
    avgSentenceLength: avg(evaluations.map(e => e.nlp.avgSentenceLength)),
    estimatedSpeakingSeconds: evaluations.reduce((sum, e) => sum + e.nlp.estimatedSpeakingSeconds, 0)
  };

  const confidence: ConfidenceEvaluation = {
    score: avg(evaluations.map(e => e.confidence.score)),
    level: avg(evaluations.map(e => e.confidence.score)) >= 80 ? 'High' : (avg(evaluations.map(e => e.confidence.score)) >= 60 ? 'Moderate' : 'Developing'),
    assertiveCount: evaluations.reduce((s, e) => s + e.confidence.assertiveCount, 0),
    hesitantCount: evaluations.reduce((s, e) => s + e.confidence.hesitantCount, 0),
    qualifiersCount: evaluations.reduce((s, e) => s + e.confidence.qualifiersCount, 0),
    assertivePhrases: Array.from(new Set(evaluations.flatMap(e => e.confidence.assertivePhrases))),
    hesitantPhrases: Array.from(new Set(evaluations.flatMap(e => e.confidence.hesitantPhrases))),
    qualifiersDetected: Array.from(new Set(evaluations.flatMap(e => e.confidence.qualifiersDetected))),
    summary: 'Calculated from candidate statements across all session responses.'
  };

  const emotion: EmotionEvaluation = {
    primaryEmotion: evaluations[0].emotion.primaryEmotion,
    sentimentScore: Math.round((evaluations.reduce((s, e) => s + e.emotion.sentimentScore, 0) / count) * 100) / 100,
    breakdown: {
      enthusiastic: avg(evaluations.map(e => e.emotion.breakdown.enthusiastic)),
      poised: avg(evaluations.map(e => e.emotion.breakdown.poised)),
      neutral: avg(evaluations.map(e => e.emotion.breakdown.neutral)),
      hesitant: avg(evaluations.map(e => e.emotion.breakdown.hesitant)),
      anxious: avg(evaluations.map(e => e.emotion.breakdown.anxious))
    },
    summary: 'Derived sentiment distribution from real answers.'
  };

  const communication: CommunicationEvaluation = {
    score: avg(evaluations.map(e => e.communication.score)),
    conciseness: avg(evaluations.map(e => e.communication.conciseness)),
    articulation: avg(evaluations.map(e => e.communication.articulation)),
    pacingStatus: 'Optimal',
    starStructure: {
      situationDetected: evaluations.some(e => e.communication.starStructure.situationDetected),
      taskDetected: evaluations.some(e => e.communication.starStructure.taskDetected),
      actionDetected: evaluations.some(e => e.communication.starStructure.actionDetected),
      resultDetected: evaluations.some(e => e.communication.starStructure.resultDetected),
      score: avg(evaluations.map(e => e.communication.starStructure.score))
    },
    summary: 'Cumulative structural pacing evaluated across candidate responses.'
  };

  const strengths = Array.from(new Set(evaluations.flatMap(e => e.strengths))).slice(0, 4);
  const weaknesses = Array.from(new Set(evaluations.flatMap(e => e.weaknesses))).slice(0, 3);
  const suggestions = Array.from(new Set(evaluations.flatMap(e => e.suggestions))).slice(0, 4);

  return {
    overallScore,
    nlp,
    confidence,
    emotion,
    communication,
    strengths,
    weaknesses,
    suggestions
  };
}
