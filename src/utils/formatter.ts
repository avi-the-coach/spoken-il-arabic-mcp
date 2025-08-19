import { SearchResult, SimilarRoot, ConjugationResponse } from '../types/api.js';

/**
 * Check if text contains Hebrew characters
 */
export function containsHebrew(text: string): boolean {
  return /[\u0590-\u05FF]/.test(text);
}

/**
 * Check if text contains Arabic characters
 */
export function containsArabic(text: string): boolean {
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(text);
}

/**
 * Detect the likely language of the search term
 */
export function detectLanguage(text: string): 'hebrew' | 'arabic' | 'latin' {
  if (containsHebrew(text)) {
    return 'hebrew';
  }
  if (containsArabic(text)) {
    return 'arabic';
  }
  return 'latin';
}

/**
 * Calculate simple string similarity (for similar roots functionality)
 */
export function calculateSimilarity(str1: string, str2: string): number {
  if (str1 === str2) return 1;
  
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1;
  
  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

/**
 * Extract root pattern (for pattern-based similarity)
 */
export function extractRootPattern(rootId: string): string {
  // Extract Hebrew root from ID like "ללכת - רוח, פעל 1"
  const match = rootId.match(/- ([א-ת]+),/);
  return match ? match[1] : rootId;
}

/**
 * Check if two roots have similar patterns
 */
export function haveSimilarPattern(root1: string, root2: string): boolean {
  const pattern1 = extractRootPattern(root1);
  const pattern2 = extractRootPattern(root2);
  
  // Check if roots have same length and similar structure
  if (pattern1.length !== pattern2.length) {
    return false;
  }
  
  // For now, simple character-by-character comparison
  // This could be enhanced with more sophisticated pattern matching
  let similarChars = 0;
  for (let i = 0; i < pattern1.length; i++) {
    if (pattern1[i] === pattern2[i]) {
      similarChars++;
    }
  }
  
  return similarChars / pattern1.length >= 0.6; // 60% similarity threshold
}