import { RoadToRecoveryApiClient } from '../api/client.js';
import { SimilarRoot, SimilarityType } from '../types/api.js';
export declare class SimilarRootsTool {
    private apiClient;
    constructor(apiClient: RoadToRecoveryApiClient);
    /**
     * Find roots similar to the given root
     */
    getSimilarRoots(rootId: string, similarityType: SimilarityType, limit?: number): Promise<SimilarRoot[]>;
    private calculateSimilarity;
    private calculatePatternSimilarity;
    private calculateMeaningSimilarity;
    private calculatePhoneticSimilarity;
}
//# sourceMappingURL=similar.d.ts.map