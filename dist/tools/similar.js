"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimilarRootsTool = void 0;
const validator_js_1 = require("../utils/validator.js");
const formatter_js_1 = require("../utils/formatter.js");
class SimilarRootsTool {
    apiClient;
    constructor(apiClient) {
        this.apiClient = apiClient;
    }
    /**
     * Find roots similar to the given root
     */
    async getSimilarRoots(rootId, similarityType, limit = 10) {
        // Validate inputs
        (0, validator_js_1.validateRootId)(rootId);
        (0, validator_js_1.validateSimilarityType)(similarityType);
        // Sanitize root ID
        const cleanRootId = (0, validator_js_1.sanitizeInput)(rootId);
        try {
            // Get all roots to compare against
            const allRoots = await this.apiClient.getAllRoots();
            const allRootIds = [...allRoots.roots.hebrew, ...allRoots.roots.taatik];
            // Get the reference root's details for meaning-based similarity
            let referenceRoot = null;
            if (similarityType === 'meaning') {
                try {
                    referenceRoot = await this.apiClient.getConjugation(cleanRootId);
                }
                catch {
                    // If we can't get the reference root details, fall back to pattern matching
                }
            }
            // Find similar roots based on the specified type
            const similarities = [];
            for (const candidateRootId of allRootIds) {
                // Skip the root itself
                if (candidateRootId === cleanRootId) {
                    continue;
                }
                const similarity = await this.calculateSimilarity(cleanRootId, candidateRootId, similarityType, referenceRoot);
                if (similarity.score > 0) {
                    similarities.push({
                        id: candidateRootId,
                        displayName: candidateRootId,
                        similarity: similarity.score,
                        reason: similarity.reason
                    });
                }
            }
            // Sort by similarity score (descending) and limit results
            similarities.sort((a, b) => b.similarity - a.similarity);
            return similarities.slice(0, limit);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to find similar roots: ${error.message}`);
            }
            throw new Error('Failed to find similar roots: Unknown error');
        }
    }
    async calculateSimilarity(rootId, candidateId, type, referenceRoot) {
        switch (type) {
            case 'pattern':
                return this.calculatePatternSimilarity(rootId, candidateId);
            case 'meaning':
                return await this.calculateMeaningSimilarity(rootId, candidateId, referenceRoot);
            case 'phonetic':
                return this.calculatePhoneticSimilarity(rootId, candidateId);
            default:
                return { score: 0, reason: 'Unknown similarity type' };
        }
    }
    calculatePatternSimilarity(rootId, candidateId) {
        const rootPattern = (0, formatter_js_1.extractRootPattern)(rootId);
        const candidatePattern = (0, formatter_js_1.extractRootPattern)(candidateId);
        // Check if patterns have similar structure
        if ((0, formatter_js_1.haveSimilarPattern)(rootId, candidateId)) {
            const similarity = (0, formatter_js_1.calculateSimilarity)(rootPattern, candidatePattern);
            return {
                score: similarity,
                reason: `Similar root pattern: ${rootPattern} ~ ${candidatePattern}`
            };
        }
        // Check for same root family (same number of letters)
        if (rootPattern.length === candidatePattern.length) {
            const similarity = (0, formatter_js_1.calculateSimilarity)(rootPattern, candidatePattern);
            if (similarity > 0.4) {
                return {
                    score: similarity * 0.8, // Slightly lower score for pattern similarity
                    reason: `Same root structure (${rootPattern.length} letters)`
                };
            }
        }
        return { score: 0, reason: 'Different pattern' };
    }
    async calculateMeaningSimilarity(rootId, candidateId, referenceRoot) {
        if (!referenceRoot) {
            return { score: 0, reason: 'Reference root details not available' };
        }
        try {
            const candidateRoot = await this.apiClient.getConjugation(candidateId);
            // Compare meanings
            const referenceMeanings = referenceRoot.root.mashmaut;
            const candidateMeanings = candidateRoot.root.mashmaut;
            let maxSimilarity = 0;
            let bestMatch = '';
            for (const refMeaning of referenceMeanings) {
                for (const candMeaning of candidateMeanings) {
                    const similarity = (0, formatter_js_1.calculateSimilarity)(refMeaning.toLowerCase(), candMeaning.toLowerCase());
                    if (similarity > maxSimilarity) {
                        maxSimilarity = similarity;
                        bestMatch = `"${refMeaning}" ~ "${candMeaning}"`;
                    }
                }
            }
            if (maxSimilarity > 0.6) {
                return {
                    score: maxSimilarity,
                    reason: `Similar meaning: ${bestMatch}`
                };
            }
            // Check for same binian (conjugation pattern)
            if (referenceRoot.root.binian === candidateRoot.root.binian) {
                return {
                    score: 0.3,
                    reason: `Same binian: ${referenceRoot.root.binian}`
                };
            }
            return { score: 0, reason: 'Different meanings' };
        }
        catch {
            return { score: 0, reason: 'Could not compare meanings' };
        }
    }
    calculatePhoneticSimilarity(rootId, candidateId) {
        // Extract root patterns for phonetic comparison
        const rootPattern = (0, formatter_js_1.extractRootPattern)(rootId);
        const candidatePattern = (0, formatter_js_1.extractRootPattern)(candidateId);
        // Simple phonetic similarity based on character similarity
        const similarity = (0, formatter_js_1.calculateSimilarity)(rootPattern, candidatePattern);
        if (similarity > 0.7) {
            return {
                score: similarity,
                reason: `Phonetically similar: ${rootPattern} ~ ${candidatePattern}`
            };
        }
        // Check for common phonetic patterns (e.g., same first/last letters)
        if (rootPattern.length > 0 && candidatePattern.length > 0) {
            if (rootPattern[0] === candidatePattern[0] ||
                rootPattern[rootPattern.length - 1] === candidatePattern[candidatePattern.length - 1]) {
                return {
                    score: 0.4,
                    reason: `Shares phonetic elements`
                };
            }
        }
        return { score: 0, reason: 'Phonetically different' };
    }
}
exports.SimilarRootsTool = SimilarRootsTool;
//# sourceMappingURL=similar.js.map