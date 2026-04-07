export interface GrammarConcept {
  id: string;
  title: string;       // e.g., "Geniş Zaman / Şimdiki Zaman (-아/어요)"
  description: string; // Turkish explanation
  rules: {
    condition: string; // e.g., "Son sesli harf ㅏ veya ㅗ ise"
    suffix: string;    // e.g., "아요"
    explanation?: string;
  }[];
  examples: ContextualSentence[];
}

export interface ContextualSentence {
  koreanParts: TextPart[];   // The sentence broken down for color coding
  turkish: string;           // "Ben elma yerim."
}

export interface TextPart {
  text: string;
  type: 'root' | 'particle' | 'ending' | 'base'; // 'base' is default unhighlighted text
}

export interface Flashcard {
  id: string;
  korean: string;
  turkish: string;
  pronunciation?: string;
  type: 'noun' | 'noun_human' | 'position' | 'verb' | 'adjective' | 'number_sino' | 'number_native' | string;
}

export interface StoryTemplate {
  id: string;
  level: string; // A1, A2
  templateParts: {
    type: 'text' | 'slot';
    value: string; // If text, it's literal. If slot, it's the category like 'noun_person'
    particleHint?: 'subject_eun_neun' | 'subject_i_ga' | 'object_eul_reul' | 'location_e';
  }[];
  turkishTranslationTemplate: string; // "Bir zamanlar [slot:noun_person] vardı..."
}
