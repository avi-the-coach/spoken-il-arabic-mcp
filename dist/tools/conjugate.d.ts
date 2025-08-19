import { RoadToRecoveryApiClient } from '../api/client.js';
import { ConjugationResponse } from '../types/api.js';
export interface ConjugationOptions {
    includeAudio?: boolean;
    includeExamples?: boolean;
    includeNegation?: boolean;
}
export declare class ConjugationTool {
    private apiClient;
    constructor(apiClient: RoadToRecoveryApiClient);
    /**
     * Get full conjugation table for a specific root
     */
    getRootConjugation(rootId: string, options?: ConjugationOptions): Promise<ConjugationResponse>;
    /**
     * Get simplified conjugation data (just the essential conjugations)
     */
    getSimpleConjugation(rootId: string): Promise<{
        root: string;
        rootArabic: string;
        meaning: string[];
        conjugations: Array<{
            person: string;
            past: string;
            present: string;
            future: string;
        }>;
    }>;
    /**
     * Check if a root ID exists in the system
     */
    validateRootExists(rootId: string): Promise<boolean>;
}
//# sourceMappingURL=conjugate.d.ts.map