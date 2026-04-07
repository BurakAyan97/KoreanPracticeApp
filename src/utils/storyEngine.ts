import type { StoryTemplate, Flashcard } from './types';
import { attachIGa, attachEunNeun, attachEulReul } from './koreanParticles';

export interface GeneratedStory {
  koreanText: string;
  turkishText: string;
}

/**
 * Randomize array element securely
 */
const getRandomElement = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

/**
 * Deterministic Engine V1:
 * Selects a template, pulls matching random flashcards,
 * constructs the Korean string applying proper particles to slots,
 * and substitutes Turkish templates with translations.
 */
export const generateStory = (
  level: string,
  allTemplates: StoryTemplate[],
  allFlashcards: Flashcard[]
): GeneratedStory | null => {
  
  const levelTemplates = allTemplates.filter(t => t.level === level);
  if (levelTemplates.length === 0) return null;

  const template = getRandomElement(levelTemplates);
  let koreanResult = '';
  let turkishResult = template.turkishTranslationTemplate;

  // Track the slots we fill so we can replace them in the Turkish template sequentially.
  // Template format: "Bir gün, bir [slot:0] vardı. O [slot:1] okula gitti."
  let slotIndex = 0;

  for (const part of template.templateParts) {
    if (part.type === 'text') {
      koreanResult += part.value;
    } else if (part.type === 'slot') {
      // Find a flashcard matching the requested type (e.g., 'noun', 'verb')
      const matchingCards = allFlashcards.filter(c => c.type === part.value);
      if (matchingCards.length === 0) {
        koreanResult += '[MISSING_WORD]';
        continue;
      }
      
      const word = getRandomElement(matchingCards);
      let wordWithParticle = word.korean;

      if (part.particleHint) {
        switch (part.particleHint) {
          case 'subject_i_ga':
            wordWithParticle = attachIGa(word.korean);
            break;
          case 'subject_eun_neun':
            wordWithParticle = attachEunNeun(word.korean);
            break;
          case 'object_eul_reul':
            wordWithParticle = attachEulReul(word.korean);
            break;
          // Could add location_e etc here if needed, but '에' doesn't change based on batchim.
        }
      }

      koreanResult += wordWithParticle;

      // Replace slot placeholder in Turkish string. (e.g. `[slot:0]`)
      turkishResult = turkishResult.replace(`[slot:${slotIndex}]`, word.turkish.toLowerCase());
      slotIndex++;
    }
  }

  return {
    koreanText: koreanResult.trim(),
    turkishText: turkishResult.trim()
  };
};
