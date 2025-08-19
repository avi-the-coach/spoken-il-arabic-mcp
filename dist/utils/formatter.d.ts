/**
 * Check if text contains Hebrew characters
 */
export declare function containsHebrew(text: string): boolean;
/**
 * Check if text contains Arabic characters
 */
export declare function containsArabic(text: string): boolean;
/**
 * Detect the likely language of the search term
 */
export declare function detectLanguage(text: string): 'hebrew' | 'arabic' | 'latin';
/**
 * Calculate simple string similarity (for similar roots functionality)
 */
export declare function calculateSimilarity(str1: string, str2: string): number;
/**
 * Extract root pattern (for pattern-based similarity)
 */
export declare function extractRootPattern(rootId: string): string;
/**
 * Check if two roots have similar patterns
 */
export declare function haveSimilarPattern(root1: string, root2: string): boolean;
//# sourceMappingURL=formatter.d.ts.map