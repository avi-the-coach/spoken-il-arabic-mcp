import { RoadToRecoveryApiClient } from '../api/client.js';
import { SearchResult, SearchType } from '../types/api.js';
export declare class SearchTool {
    private apiClient;
    constructor(apiClient: RoadToRecoveryApiClient);
    /**
     * Search for Arabic roots by Hebrew/Arabic terms or transliteration
     */
    searchArabicRoots(searchTerm: string, searchType?: SearchType, limit?: number): Promise<SearchResult[]>;
    private determineSearchType;
    private findMatches;
    private extractMeaning;
    private removeDuplicates;
}
//# sourceMappingURL=search.d.ts.map