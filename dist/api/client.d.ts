import { AllRootsResponse, ConjugationResponse } from '../types/api.js';
export declare class RoadToRecoveryApiClient {
    private readonly baseUrl;
    private readonly timeout;
    private fetchWithTimeout;
    private handleApiError;
    /**
     * Get all roots from the API
     */
    getAllRoots(): Promise<AllRootsResponse>;
    /**
     * Get conjugation details for a specific root
     * @param rootId The exact root ID as returned from the search
     */
    getConjugation(rootId: string): Promise<ConjugationResponse>;
    /**
     * Check if the API is accessible
     */
    healthCheck(): Promise<boolean>;
}
//# sourceMappingURL=client.d.ts.map