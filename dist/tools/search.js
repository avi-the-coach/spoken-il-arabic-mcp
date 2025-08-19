"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchTool = void 0;
const validator_js_1 = require("../utils/validator.js");
const formatter_js_1 = require("../utils/formatter.js");
class SearchTool {
    apiClient;
    constructor(apiClient) {
        this.apiClient = apiClient;
    }
    /**
     * Search for Arabic roots by Hebrew/Arabic terms or transliteration
     */
    async searchArabicRoots(searchTerm, searchType = 'auto', limit = 10) {
        // Validate inputs
        (0, validator_js_1.validateSearchTerm)(searchTerm);
        (0, validator_js_1.validateSearchType)(searchType);
        (0, validator_js_1.validateLimit)(limit);
        // Sanitize search term
        const cleanTerm = (0, validator_js_1.sanitizeInput)(searchTerm);
        try {
            // Get all roots from the API
            const allRoots = await this.apiClient.getAllRoots();
            // Determine search strategy
            const actualSearchType = searchType === 'auto' ? this.determineSearchType(cleanTerm) : searchType;
            // Search in the appropriate array
            const results = [];
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
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Search failed: ${error.message}`);
            }
            throw new Error('Search failed: Unknown error');
        }
    }
    determineSearchType(term) {
        const language = (0, formatter_js_1.detectLanguage)(term);
        if (language === 'hebrew') {
            return 'hebrew';
        }
        else if (language === 'arabic') {
            return 'arabic';
        }
        // For Latin script, try both Hebrew and Arabic
        return 'auto';
    }
    findMatches(searchTerm, roots, type) {
        const results = [];
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
    extractMeaning(hebrewRoot) {
        // Extract meaning from Hebrew root format: "ללכת - רוח, פעל 1"
        const parts = hebrewRoot.split(' - ');
        return parts.length > 1 ? parts[0] : '';
    }
    removeDuplicates(results) {
        const seen = new Set();
        return results.filter(result => {
            if (seen.has(result.id)) {
                return false;
            }
            seen.add(result.id);
            return true;
        });
    }
}
exports.SearchTool = SearchTool;
//# sourceMappingURL=search.js.map