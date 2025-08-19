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
    who: string;
    avar: string;
    hoveh: string;
    atid: string;
    zivoi: string;
    poel: string;
    paul: string;
}
export interface RootDetails {
    id: string;
    idArb: string;
    shoresh: string;
    shoreshArabic: string;
    mashmaut: string[];
    binian: string;
    gizra: string;
    peula: string;
    heaarot: string;
    hataiot: Conjugation[];
}
export interface AudioInfo {
    root: string;
    binian: string;
    zivoi: string;
    paul: string;
    poal: string;
}
export interface ExampleSentence {
    usea: string;
    useh: string;
    exmpla: string;
    exmplh: string;
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
export type SearchType = 'auto' | 'hebrew' | 'arabic';
export type SimilarityType = 'pattern' | 'meaning' | 'phonetic';
export interface ApiError {
    message: string;
    status?: number;
    code?: string;
}
//# sourceMappingURL=api.d.ts.map