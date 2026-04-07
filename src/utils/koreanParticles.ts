/**
 * Korean Particle Resolver
 * Detects whether a Korean word ends in a consonant (batchim) or vowel.
 */

const GA_CODE = 44032; // The unicode value for '가'
const HIEUT_CODE = 55203; // The unicode value for '힣'

/**
 * Checks if a given Korean character has a final consonant (batchim).
 * @param char A single Korean character
 * @returns true if the character has a batchim, false otherwise
 */
export const hasBatchim = (char: string): boolean => {
  if (char.length !== 1) {
    char = char.charAt(char.length - 1);
  }

  const charCode = char.charCodeAt(0);

  // Check if character is within the Hangul Syllables block
  if (charCode < GA_CODE || charCode > HIEUT_CODE) {
    return false; // Not a Korean syllable, default to false
  }

  // Calculate the batchim index. 
  // Each initial consonant + vowel combination has 28 possible final consonant variations (including no final consonant)
  // Index 0 means no batchim.
  const batchimIndex = (charCode - GA_CODE) % 28;

  return batchimIndex !== 0;
};

/**
 * Attaches the correct particle string depending on the last character's batchim.
 * @param word The word to attach the particle to
 * @param withBatchim The string to attach if the word has a batchim (e.g. '은', '이', '을')
 * @param withoutBatchim The string to attach if the word has NO batchim (e.g. '는', '가', '를')
 * @returns The combined word and particle
 */
export const applyParticle = (word: string, withBatchim: string, withoutBatchim: string): string => {
  if (!word) return '';
  const lastChar = word.charAt(word.length - 1);
  return word + (hasBatchim(lastChar) ? withBatchim : withoutBatchim);
};

// Convenience functions for common particles
export const attachEunNeun = (word: string) => applyParticle(word, '은', '는');
export const attachIGa = (word: string) => applyParticle(word, '이', '가');
export const attachEulReul = (word: string) => applyParticle(word, '을', '를');

/**
 * For (으)로 (Euro/Ro), there is an exception: if the batchim is specifically 'ㄹ' (R/L), 
 * it takes '로' without the '으'.
 */
export const attachEuroRo = (word: string) => {
  if (!word) return '';
  const lastChar = word.charAt(word.length - 1);
  const charCode = lastChar.charCodeAt(0);
  
  if (charCode < GA_CODE || charCode > HIEUT_CODE) {
    return word + '로'; 
  }

  const batchimIndex = (charCode - GA_CODE) % 28;
  
  if (batchimIndex === 0 || batchimIndex === 8) { 
    // 0 = no batchim, 8 = 'ㄹ' batchim
    return word + '로';
  } else {
    return word + '으로';
  }
};
