import { SearchType, SimilarityType } from '../types/api.js';
export declare class ValidationError extends Error {
    constructor(message: string);
}
export declare function validateSearchTerm(term: string): void;
export declare function validateSearchType(type: SearchType): void;
export declare function validateLimit(limit: number): void;
export declare function validateRootId(rootId: string): void;
export declare function validateSimilarityType(type: SimilarityType): void;
export declare function sanitizeInput(input: string): string;
//# sourceMappingURL=validator.d.ts.map