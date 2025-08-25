/**
 * Type definitions for the roadtorecovery.org.il API
 */

export interface AllRootsResponse {
  roots: {
    hebrew: string[];
    taatik: string[];
  };
  belonging: Record<string, unknown>;
  blessings: Record<string, unknown>;
  proverbs: Record<string, unknown>;
  about: Record<string, unknown>;
}

export interface Conjugation {
  who: string;       // גוף (אנא, אנת, הו, היא, וכו')
  avar: string;      // עבר
  hoveh: string;     // הווה
  atid: string;      // עתיד
  zivoi: string;     // צווי
  poel: string;      // בינוני פועל
  paul: string;      // בינוני פעול
}

export interface RootDetails {
  id: string;              // מזהה השורש
  idArb: string;           // מזהה בערבית
  shoresh: string;         // השורש בעברית
  shoreshArabic: string;   // השורש בערבית
  mashmaut: string[];      // משמעויות
  binian: string;          // בניין (פעל 1, פעל 2, וכו')
  gizra: string;           // גזרה (ע"ו, ל"ה, וכו')
  peula: string;           // שם הפעולה
  heaarot: string;         // הערות
  hataiot: Conjugation[];  // הטיות
}

export interface AudioInfo {
  root: string;
  binian: string;
  zivoi: string;
  paul: string;
  poal: string;
}

export interface ExampleSentence {
  usea: string;    // המילה בערבית
  useh: string;    // המילה בעברית
  exmpla: string;  // דוגמה בערבית
  exmplh: string;  // דוגמה בעברית
}

export interface SentencesInfo {
  root: string;
  binian: string;
  sentences: ExampleSentence[];
}

export interface ConjugationResponse {
  root: RootDetails;
  audio: AudioInfo;
  sentences: SentencesInfo;
}

export interface SearchResult {
  id: string;
  displayName: string;
  type: 'hebrew' | 'taatik';
}

export interface SimilarRoot {
  id: string;
  displayName: string;
  similarity: number;
  reason: string;
}

// Tool parameter types
export type SearchType = 'auto' | 'hebrew' | 'arabic';
export type SimilarityType = 'pattern' | 'meaning' | 'phonetic';

// Dictionary API Types
export interface DictionaryWordMatch {
  id: number;                    // Unique word ID for detailed lookup
  hebrew: string;                // Hebrew text
  arabic: string;                // Arabic text
  transliteration?: string;      // Hebrew transliteration
  phonetic?: string;             // English phonetic
  word_type?: string;            // noun, verb, adjective, etc.
  gender?: string;               // masculine, feminine
  number?: string;               // singular, plural
  has_audio?: boolean;           // Audio available indicator
  has_image?: boolean;           // Image available indicator
  verified?: boolean;            // Verified entry indicator
}

export interface DictionarySearchResponse {
  query: string;                         // Original search term
  total_results: number;                 // Total number of matches found
  exact_matches: DictionaryWordMatch[];  // Perfect matches
  soundex_matches: DictionaryWordMatch[]; // Phonetically similar
  additional_matches: DictionaryWordMatch[]; // Contains search term
}

export interface DictionaryExample {
  arabic: string;               // Example sentence in Arabic
  hebrew: string;               // Example sentence in Hebrew  
  transliteration?: string;     // Arabic transliteration
  context?: string;             // Usage context
}

export interface RelatedWord {
  id: number;
  hebrew: string;
  arabic: string;
  transliteration?: string;
  relationship: string;         // synonym, antonym, related, etc.
}

export interface DictionaryWordDetails {
  id: number;
  hebrew: string;               // Primary Hebrew translation
  arabic: string;               // Primary Arabic word
  transliteration: string;      // Hebrew transliteration
  phonetic?: string;            // English phonetic pronunciation
  word_type: string;            // Part of speech
  gender?: string;              // Grammatical gender
  number?: string;              // Singular/plural
  category?: string;            // Semantic category (בבית, etc.)
  definitions: string[];        // Multiple definitions/meanings
  examples: DictionaryExample[]; // Usage examples
  related_words: RelatedWord[];  // Synonyms, antonyms, related terms
  has_audio: boolean;
  has_image: boolean;
  verified: boolean;
}

// Error types
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}