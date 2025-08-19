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

// Error types
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}