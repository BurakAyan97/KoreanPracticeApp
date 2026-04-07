export interface GrammarV2 {
  version: number;
  level: string;
  title: string;
  uiGuide: {
    sameKeySameColor: boolean;
    wordColorMode: string;
    suffixPalette: Record<string, string>;
    renderRule: string;
  };
  lessons: LessonV2[];
}

export interface LessonV2 {
  id: string;
  order: number;
  title: string;
  description: string;
  teacherExplanation: string;
  exampleMode?: string;
  rules: {
    name: string;
    explanation: string;
    pattern?: string;
  }[];
  examples: GrammarExampleV2[];
  checkpoints?: string[];
}

export interface GrammarExampleV2 {
  koText: string;
  trText: string;
  pairs: GrammarPairV2[];
}

export interface GrammarPairV2 {
  ko: string;
  tr: string;
  key: string;
  type: 'word' | 'suffix';
}

// Keeping V1 for compatibility during migration if needed
export interface GrammarConcept {
  id: string;
  title: string;
  description: string;
  rules: {
    condition: string;
    suffix: string;
    explanation?: string;
  }[];
  examples: ContextualSentence[];
}

export interface ContextualSentence {
  koreanSentence: string;
  romanizedSentence: string;
  turkishSentence: string;
  words: TranslatedWord[];
}

export interface TranslatedWord {
  korean: string;
  romanized: string;
  turkish: string;
}

export interface Flashcard {
  id: string;
  korean: string;
  turkish: string;
  pronunciation?: string;
  type: string;
}

export interface GeneratedStory {
  id: string;
  level: string;
  title: {
    korean: string;
    turkish: string;
  };
  sentences: ContextualSentence[];
}
