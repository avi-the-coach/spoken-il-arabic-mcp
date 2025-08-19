import { RoadToRecoveryApiClient } from '../api/client.js';
import { SearchResult, SearchType } from '../types/api.js';
import { validateSearchTerm, validateSearchType, validateLimit, sanitizeInput } from '../utils/validator.js';
import { detectLanguage } from '../utils/formatter.js';

export class SearchTool {
  private apiClient: RoadToRecoveryApiClient;

  constructor(apiClient: RoadToRecoveryApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Search for Arabic roots by Hebrew/Arabic terms or transliteration
   */
  async searchArabicRoots(
    searchTerm: string,
    searchType: SearchType = 'auto',
    limit: number = 10
  ): Promise<SearchResult[]> {
    // Validate inputs
    validateSearchTerm(searchTerm);
    validateSearchType(searchType);
    validateLimit(limit);

    // Sanitize search term
    const cleanTerm = sanitizeInput(searchTerm);

    try {
      // Get all roots from the API
      const allRoots = await this.apiClient.getAllRoots();
      
      // Determine search strategy
      const actualSearchType = searchType === 'auto' ? this.determineSearchType(cleanTerm) : searchType;
      
      // Search in the appropriate array
      const results: SearchResult[] = [];
      
      if (actualSearchType === 'hebrew' || actualSearchType === 'auto') {
        // Search in Hebrew roots
        const hebrewMatches = this.findMatches(cleanTerm, allRoots.roots.hebrew, 'hebrew');
        results.push(...hebrewMatches);
      }
      
      if (actualSearchType === 'arabic' || actualSearchType === 'auto') {
        // Search in Arabic transliteration
        const arabicMatches = this.findMatches(cleanTerm, allRoots.roots.taatik, 'taatik');
        results.push(...arabicMatches);
      }
      
      // Remove duplicates and limit results
      const uniqueResults = this.removeDuplicates(results);
      return uniqueResults.slice(0, limit);
      
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Search failed: ${error.message}`);
      }
      throw new Error('Search failed: Unknown error');
    }
  }

  private determineSearchType(term: string): SearchType {
    const language = detectLanguage(term);
    if (language === 'hebrew') {
      return 'hebrew';
    } else if (language === 'arabic') {
      return 'arabic';
    }
    // For Latin script, try both Hebrew and Arabic
    return 'auto';
  }

  private findMatches(searchTerm: string, roots: string[], type: 'hebrew' | 'taatik'): SearchResult[] {
    const results: SearchResult[] = [];
    const lowerSearchTerm = searchTerm.toLowerCase();

    for (const root of roots) {
      const lowerRoot = root.toLowerCase();
      
      // Exact match gets highest priority
      if (lowerRoot === lowerSearchTerm) {
        results.unshift({
          id: root,
          displayName: root,
          type: type
        });
        continue;
      }
      
      // Contains match
      if (lowerRoot.includes(lowerSearchTerm)) {
        results.push({
          id: root,
          displayName: root,
          type: type
        });
        continue;
      }
      
      // For Hebrew roots, also check if search term appears in the meaning part
      if (type === 'hebrew') {
        const meaningPart = this.extractMeaning(root);
        if (meaningPart && meaningPart.toLowerCase().includes(lowerSearchTerm)) {
          results.push({
            id: root,
            displayName: root,
            type: type
          });
        }
      }
    }

    return results;
  }

  private extractMeaning(hebrewRoot: string): string {
    // Extract meaning from Hebrew root format: "ללכת - רוח, פעל 1"
    const parts = hebrewRoot.split(' - ');
    return parts.length > 1 ? parts[0] : '';
  }

  private removeDuplicates(results: SearchResult[]): SearchResult[] {
    const seen = new Set<string>();
    return results.filter(result => {
      if (seen.has(result.id)) {
        return false;
      }
      seen.add(result.id);
      return true;
    });
  }
}