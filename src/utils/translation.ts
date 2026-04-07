/**
 * Simple translation utility using public unofficial endpoints
 */

export interface TranslationResult {
  ko: string;
  tr: string;
  pronunciation?: string;
}

export const translateWord = async (query: string): Promise<TranslationResult | null> => {
  try {
    const isKorean = /[\u3131-\uD79D]/.test(query);
    const sl = isKorean ? 'ko' : 'tr';
    const tl = isKorean ? 'tr' : 'ko';

    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&dt=rm&q=${encodeURIComponent(query)}`
    );
    const data = await response.json();

    if (data && data[0]) {
      const translatedText = data[0][0][0];
      
      // Google Translate returns romanization in specific indices
      // Usually data[0][1][3] is source romanization if source is non-latin
      // Or data[0][0][3] might be target romanization
      let pronunciation = '';
      
      // Look for the romanization block
      if (data[0]) {
        for (const part of data[0]) {
          if (part && part.length >= 4 && typeof part[3] === 'string' && part[3].length > 0) {
            pronunciation = part[3];
            break;
          }
          if (part && part.length >= 3 && typeof part[2] === 'string' && part[2].length > 0 && part[2] !== query) {
            pronunciation = part[2];
          }
        }
      }

      return {
        ko: isKorean ? query : translatedText,
        tr: isKorean ? translatedText : query,
        pronunciation: pronunciation || ''
      };
    }
    
    return null;
  } catch (err) {
    console.error("Translation error", err);
    return null;
  }
};
