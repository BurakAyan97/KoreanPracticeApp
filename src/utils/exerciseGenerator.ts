import type { LessonV2, GrammarPairV2 } from './types';

export interface BlankExercise {
  id: string;
  /** Full Korean sentence with one part replaced by _____ */
  sentenceWithBlank: string;
  /** The original full Korean sentence */
  fullSentence: string;
  /** Turkish translation of the sentence */
  turkishTranslation: string;
  /** The correct answer (Korean text that fills the blank) */
  correctAnswer: string;
  /** Turkish hint for the correct answer */
  correctAnswerHint: string;
  /** Whether the blank is a suffix or a word */
  blankType: 'word' | 'suffix';
  /** 3 options: 1 correct + 2 distractors, shuffled */
  options: ExerciseOption[];
}

export interface ExerciseOption {
  id: string;
  text: string;
  hint: string;
  isCorrect: boolean;
}

/** Seeded pseudo-random number generator for deterministic shuffling */
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 16807 + 0) % 2147483647;
    return this.seed / 2147483647;
  }
}

function shuffleArray<T>(arr: T[], rng: SeededRandom): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng.next() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Collects all unique Korean tokens appearing in a lesson,
 * grouped by their type (word vs suffix).
 */
function collectDistractorPool(lesson: LessonV2): { words: GrammarPairV2[]; suffixes: GrammarPairV2[] } {
  const wordMap = new Map<string, GrammarPairV2>();
  const suffixMap = new Map<string, GrammarPairV2>();

  for (const example of lesson.examples) {
    for (const pair of example.pairs) {
      const target = pair.type === 'suffix' ? suffixMap : wordMap;
      if (!target.has(pair.ko)) {
        target.set(pair.ko, pair);
      }
    }
  }

  return {
    words: Array.from(wordMap.values()),
    suffixes: Array.from(suffixMap.values()),
  };
}

/** Built-in suffix distractors grouped by key type */
const SUFFIX_FALLBACKS: Record<string, { ko: string; tr: string }[]> = {
  topic: [
    { ko: '은', tr: '(konu eki)' },
    { ko: '는', tr: '(konu eki)' },
    { ko: '이', tr: '(özne eki)' },
    { ko: '가', tr: '(özne eki)' },
    { ko: '을', tr: '(nesne eki)' },
    { ko: '를', tr: '(nesne eki)' },
  ],
  subject: [
    { ko: '이', tr: '(özne eki)' },
    { ko: '가', tr: '(özne eki)' },
    { ko: '은', tr: '(konu eki)' },
    { ko: '는', tr: '(konu eki)' },
    { ko: '을', tr: '(nesne eki)' },
    { ko: '를', tr: '(nesne eki)' },
  ],
  object: [
    { ko: '을', tr: '(nesne eki)' },
    { ko: '를', tr: '(nesne eki)' },
    { ko: '은', tr: '(konu eki)' },
    { ko: '는', tr: '(konu eki)' },
    { ko: '이', tr: '(özne eki)' },
    { ko: '가', tr: '(özne eki)' },
  ],
  location: [
    { ko: '에', tr: '-de/-da' },
    { ko: '에서', tr: '-de (eylem yeri)' },
    { ko: '으로', tr: '-e doğru' },
    { ko: '로', tr: '-le' },
    { ko: '까지', tr: '-e kadar' },
  ],
  actionPlace: [
    { ko: '에서', tr: '-de (eylem yeri)' },
    { ko: '에', tr: '-de/-da' },
    { ko: '으로', tr: '-e doğru' },
    { ko: '까지', tr: '-e kadar' },
  ],
  copula: [
    { ko: '이에요', tr: '-dır / olmak' },
    { ko: '예요', tr: '-dır / olmak' },
    { ko: '입니다', tr: '-dır (resmî)' },
    { ko: '입니까', tr: '-dır? (resmî soru)' },
    { ko: '이었어요', tr: '-ydı' },
  ],
  present: [
    { ko: '아요', tr: '-(ı)yor' },
    { ko: '어요', tr: '-(ı)yor' },
    { ko: '해요', tr: 'yapıyor' },
    { ko: '았어요', tr: '-dı (geçmiş)' },
    { ko: '겠어요', tr: '-ecek (gelecek)' },
  ],
  past: [
    { ko: '았어요', tr: '-dı' },
    { ko: '었어요', tr: '-dı' },
    { ko: '했어요', tr: 'yaptı' },
    { ko: '아요', tr: '-(ı)yor' },
    { ko: '겠어요', tr: '-ecek' },
  ],
  connective: [
    { ko: '고', tr: 've' },
    { ko: '지만', tr: 'ama' },
    { ko: '아서', tr: 'çünkü' },
    { ko: '어서', tr: 'çünkü' },
    { ko: '면', tr: '-sa/-se' },
  ],
  reason: [
    { ko: '서', tr: 'çünkü' },
    { ko: '니까', tr: 'çünkü' },
    { ko: '고', tr: 've' },
    { ko: '지만', tr: 'ama' },
    { ko: '면', tr: '-sa/-se' },
  ],
  formal: [
    { ko: '입니다', tr: '-dır (resmî)' },
    { ko: '입니까', tr: '-dır? (resmî soru)' },
    { ko: '이에요', tr: '-dır (günlük)' },
    { ko: '예요', tr: '-dır (günlük)' },
  ],
  contrast: [
    { ko: '지만', tr: 'ama' },
    { ko: '고', tr: 've' },
    { ko: '서', tr: 'çünkü' },
  ],
};

/**
 * Picks 2 distractor options for a given correct pair.
 * Tries to find plausible distractors from:
 *   1. Same-type tokens in the lesson
 *   2. Fallback banks by suffix key
 */
function pickDistractors(
  correct: GrammarPairV2,
  pool: { words: GrammarPairV2[]; suffixes: GrammarPairV2[] },
  rng: SeededRandom,
): { ko: string; tr: string }[] {
  const candidates: { ko: string; tr: string }[] = [];

  // Try lesson pool first
  const sameTypePool = correct.type === 'suffix' ? pool.suffixes : pool.words;
  for (const p of sameTypePool) {
    if (p.ko !== correct.ko) {
      candidates.push({ ko: p.ko, tr: p.tr });
    }
  }

  // Add fallback suffixes if needed
  if (correct.type === 'suffix') {
    const fallbacks = SUFFIX_FALLBACKS[correct.key] || [];
    for (const fb of fallbacks) {
      if (fb.ko !== correct.ko && !candidates.find(c => c.ko === fb.ko)) {
        candidates.push(fb);
      }
    }

    // Also try other suffix categories as fallback
    if (candidates.length < 2) {
      for (const key of Object.keys(SUFFIX_FALLBACKS)) {
        if (key !== correct.key) {
          for (const fb of SUFFIX_FALLBACKS[key]) {
            if (fb.ko !== correct.ko && !candidates.find(c => c.ko === fb.ko)) {
              candidates.push(fb);
            }
          }
        }
      }
    }
  }

  // Shuffle and pick 2
  const shuffled = shuffleArray(candidates, rng);
  return shuffled.slice(0, 2);
}

/**
 * Generates 5 fill-in-the-blank exercises from a given lesson.
 * Uses a time-based seed so the exercises change each time, 
 * but are deterministic within a single generation call.
 */
export function generateExercises(lesson: LessonV2, seed?: number): BlankExercise[] {
  const rng = new SeededRandom(seed ?? Date.now());
  const pool = collectDistractorPool(lesson);
  const exercises: BlankExercise[] = [];

  // Create a shuffled list of (exampleIndex, pairIndex) for potential blanks
  const blankCandidates: { exIdx: number; pairIdx: number }[] = [];

  for (let exIdx = 0; exIdx < lesson.examples.length; exIdx++) {
    const example = lesson.examples[exIdx];
    for (let pairIdx = 0; pairIdx < example.pairs.length; pairIdx++) {
      blankCandidates.push({ exIdx, pairIdx });
    }
  }

  const shuffledCandidates = shuffleArray(blankCandidates, rng);

  // Use a Set to avoid duplicate example sentences
  const usedExamples = new Set<number>();
  let exerciseCount = 0;

  for (const candidate of shuffledCandidates) {
    if (exerciseCount >= 5) break;
    
    // Skip if we already used this example
    if (usedExamples.has(candidate.exIdx)) continue;

    const example = lesson.examples[candidate.exIdx];
    const blankPair = example.pairs[candidate.pairIdx];

    // Generate distractors
    const distractors = pickDistractors(blankPair, pool, rng);
    if (distractors.length < 2) continue; // Not enough distractors, skip

    // Build the sentence with a blank
    const sentenceParts = example.pairs.map(p => p.ko);
    const blankSentence = sentenceParts
      .map((part, idx) => idx === candidate.pairIdx ? '_____' : part)
      .join('');

    // Create options
    const correctOption: ExerciseOption = {
      id: `opt-correct-${exerciseCount}`,
      text: blankPair.ko,
      hint: blankPair.tr,
      isCorrect: true,
    };

    const distractorOptions: ExerciseOption[] = distractors.map((d, i) => ({
      id: `opt-distractor-${exerciseCount}-${i}`,
      text: d.ko,
      hint: d.tr,
      isCorrect: false,
    }));

    const options = shuffleArray([correctOption, ...distractorOptions], rng);

    exercises.push({
      id: `exercise-${lesson.id}-${exerciseCount}`,
      sentenceWithBlank: blankSentence,
      fullSentence: example.koText,
      turkishTranslation: example.trText,
      correctAnswer: blankPair.ko,
      correctAnswerHint: blankPair.tr,
      blankType: blankPair.type,
      options,
    });

    usedExamples.add(candidate.exIdx);
    exerciseCount++;
  }

  return exercises;
}
