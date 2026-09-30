import { EmotionEvaluation } from '../types';

const ENTHUSIASTIC_LEXICON = [
  'passion', 'passionate', 'excited', 'exciting', 'love', 'eager', 'proud',
  'energized', 'thrive', 'thrilled', 'fascinated', 'enjoy', 'dedicated',
  'commitment', 'exceeded', 'remarkable', 'breakthrough', 'vital', 'rewarding'
];

const POISED_LEXICON = [
  'structured', 'calm', 'objective', 'measured', 'deliberate', 'perspective',
  'systematic', 'alignment', 'collaborate', 'respect', 'consensus', 'pragmatic',
  'balanced', 'stable', 'methodical', 'diligence', 'clarity', 'organized'
];

const ANXIOUS_LEXICON = [
  'worried', 'panic', 'overwhelmed', 'stressful', 'nervous', 'scared',
  'dread', 'intimidated', 'struggle', 'mess', 'failed badly', 'frightened', 'anxious'
];

const HESITANT_LEXICON = [
  'maybe', 'perhaps', 'hopefully', 'i guess', 'not sure', 'confused',
  'somewhat', 'sort of', 'uncertain', 'might', 'doubt'
];

export function analyzeEmotion(text: string): EmotionEvaluation {
  const clean = text.toLowerCase().trim();
  
  if (!clean) {
    return {
      primaryEmotion: 'Neutral',
      sentimentScore: 0,
      breakdown: {
        enthusiastic: 0,
        poised: 0,
        neutral: 100,
        hesitant: 0,
        anxious: 0
      },
      summary: 'No answer recorded yet.'
    };
  }

  let enthScore = 0;
  let poiseScore = 0;
  let anxiousScore = 0;
  let hesitantScore = 0;

  ENTHUSIASTIC_LEXICON.forEach(w => {
    const reg = new RegExp(`\\b${w}\\b`, 'gi');
    const matches = clean.match(reg);
    if (matches) enthScore += matches.length * 4;
  });

  POISED_LEXICON.forEach(w => {
    const reg = new RegExp(`\\b${w}\\b`, 'gi');
    const matches = clean.match(reg);
    if (matches) poiseScore += matches.length * 4;
  });

  ANXIOUS_LEXICON.forEach(w => {
    const reg = new RegExp(`\\b${w}\\b`, 'gi');
    const matches = clean.match(reg);
    if (matches) anxiousScore += matches.length * 5;
  });

  HESITANT_LEXICON.forEach(w => {
    const reg = new RegExp(`\\b${w}\\b`, 'gi');
    const matches = clean.match(reg);
    if (matches) hesitantScore += matches.length * 4;
  });

  // Base allocation derived from actual matches
  const baseEnth = 15 + enthScore;
  const basePoise = 30 + poiseScore;
  const baseNeutral = 25;
  const baseHesitant = 15 + hesitantScore;
  const baseAnxious = 5 + anxiousScore;

  const total = baseEnth + basePoise + baseNeutral + baseHesitant + baseAnxious;

  const enthusiastic = Math.round((baseEnth / total) * 100);
  const poised = Math.round((basePoise / total) * 100);
  const neutral = Math.round((baseNeutral / total) * 100);
  const hesitant = Math.round((baseHesitant / total) * 100);
  const anxious = Math.max(0, 100 - (enthusiastic + poised + neutral + hesitant));

  let primaryEmotion: 'Enthusiastic' | 'Poised' | 'Neutral' | 'Hesitant' | 'Anxious' = 'Poised';
  const maxVal = Math.max(enthusiastic, poised, neutral, hesitant, anxious);

  if (anxious === maxVal && anxiousScore > 0) {
    primaryEmotion = 'Anxious';
  } else if (hesitant === maxVal && hesitantScore > 0) {
    primaryEmotion = 'Hesitant';
  } else if (enthusiastic === maxVal && enthScore > 0) {
    primaryEmotion = 'Enthusiastic';
  } else if (poised === maxVal) {
    primaryEmotion = 'Poised';
  } else {
    primaryEmotion = 'Neutral';
  }

  // Sentiment calculation from actual polarity
  const positive = enthScore + poiseScore;
  const negative = anxiousScore + (hesitantScore * 0.7);
  const sentimentScore = Math.max(-1, Math.min(1, Math.round(((positive - negative) / Math.max(1, positive + negative + 2)) * 100) / 100));

  let summary = '';
  switch (primaryEmotion) {
    case 'Enthusiastic':
      summary = 'Spoken answer radiated high genuine energy and proactive engagement with the challenge.';
      break;
    case 'Poised':
      summary = 'Composed and thoughtful verbal demeanor, articulating responses in a calm, structured tone.';
      break;
    case 'Neutral':
      summary = 'Direct and factual response without excessive emotion markers.';
      break;
    case 'Hesitant':
      summary = 'Noticeable linguistic uncertainty markers. Practicing decisive phrasing will elevate perceived authority.';
      break;
    case 'Anxious':
      summary = 'Elevated stress indicators detected in vocabulary. Taking a deliberate pause before answering will help stabilize delivery.';
      break;
  }

  return {
    primaryEmotion,
    sentimentScore,
    breakdown: {
      enthusiastic,
      poised,
      neutral,
      hesitant,
      anxious
    },
    summary
  };
}
