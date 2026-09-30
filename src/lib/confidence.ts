import { ConfidenceEvaluation } from '../types';

const ASSERTIVE_PHRASES = [
  'i led', 'i built', 'i created', 'i resolved', 'i engineered', 'i decided',
  'i took ownership', 'i spearheaded', 'i established', 'i implemented',
  'my priority was', 'my objective', 'we achieved', 'the outcome was',
  'i recommended', 'i prioritized', 'my approach', 'i ensured', 'i drove',
  'i directed', 'i managed', 'i designed'
];

const HESITANT_PHRASES = [
  'i guess', 'im not sure', "i'm not sure", 'maybe', 'probably',
  'hopefully', 'i think maybe', 'if that makes sense', 'sort of tried',
  'i kind of', 'i just basically', 'sorry if', 'i might be wrong',
  'just my opinion', 'kind of like'
];

const QUALIFIERS = [
  'kind of', 'sort of', 'somewhat', 'fairly', 'pretty much',
  'a little bit', 'more or less', 'per se'
];

export function analyzeConfidence(text: string): ConfidenceEvaluation {
  const clean = text.toLowerCase().trim();
  
  if (!clean) {
    return {
      score: 0,
      level: 'Developing',
      assertiveCount: 0,
      hesitantCount: 0,
      qualifiersCount: 0,
      assertivePhrases: [],
      hesitantPhrases: [],
      qualifiersDetected: [],
      summary: 'No answer recorded yet. Answer the prompt to evaluate delivery confidence.'
    };
  }

  const detectedAssertive: string[] = [];
  ASSERTIVE_PHRASES.forEach(phrase => {
    if (clean.includes(phrase)) {
      detectedAssertive.push(phrase);
    }
  });

  const detectedHesitant: string[] = [];
  HESITANT_PHRASES.forEach(phrase => {
    if (clean.includes(phrase)) {
      detectedHesitant.push(phrase);
    }
  });

  const detectedQualifiers: string[] = [];
  QUALIFIERS.forEach(qual => {
    if (clean.includes(qual)) {
      detectedQualifiers.push(qual);
    }
  });

  const words = clean.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  if (wordCount < 10) {
    return {
      score: Math.min(40, wordCount * 3),
      level: 'Developing',
      assertiveCount: detectedAssertive.length,
      hesitantCount: detectedHesitant.length,
      qualifiersCount: detectedQualifiers.length,
      assertivePhrases: detectedAssertive,
      hesitantPhrases: detectedHesitant,
      qualifiersDetected: detectedQualifiers,
      summary: 'Answer was too brief to establish executive confidence.'
    };
  }

  // Base calculated from active ownership ratio
  let calculatedScore = 70;
  calculatedScore += (detectedAssertive.length * 6);
  calculatedScore -= (detectedHesitant.length * 8);
  calculatedScore -= (detectedQualifiers.length * 4);

  if (wordCount < 40) {
    calculatedScore -= 15;
  } else if (wordCount >= 90 && wordCount <= 260) {
    calculatedScore += 5;
  }

  const score = Math.min(100, Math.max(10, Math.round(calculatedScore)));

  let level: 'High' | 'Moderate' | 'Developing' = 'Moderate';
  if (score >= 80) {
    level = 'High';
  } else if (score < 60) {
    level = 'Developing';
  }

  let summary = '';
  if (level === 'High') {
    summary = `Commanding executive presence. Detected ${detectedAssertive.length} active ownership statement(s) with minimal hedging.`;
  } else if (level === 'Moderate') {
    summary = `Steady professional delivery. Expanding direct first-person ownership statements will strengthen conviction.`;
  } else {
    summary = `Hesitation markers or qualifying clauses detected (${detectedHesitant.length} hesitant, ${detectedQualifiers.length} qualifiers). Anchor your points in direct action.`;
  }

  return {
    score,
    level,
    assertiveCount: detectedAssertive.length,
    hesitantCount: detectedHesitant.length,
    qualifiersCount: detectedQualifiers.length,
    assertivePhrases: detectedAssertive,
    hesitantPhrases: detectedHesitant,
    qualifiersDetected: detectedQualifiers,
    summary
  };
}
