import { RoadToRecoveryApiClient } from '../api/client.js';
import { SimilarRoot, SimilarityType, ConjugationResponse } from '../types/api.js';
import { validateRootId, validateSimilarityType, sanitizeInput } from '../utils/validator.js';
import { 
  calculateSimilarity, 
  haveSimilarPattern, 
  extractRootPattern 
} from '../utils/formatter.js';

export class SimilarRootsTool {
  private apiClient: RoadToRecoveryApiClient;

  constructor(apiClient: RoadToRecoveryApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Find roots similar to the given root
   */
  async getSimilarRoots(
    rootId: string,
    similarityType: SimilarityType,
    limit: number = 10
  ): Promise<SimilarRoot[]> {
    // Validate inputs
    validateRootId(rootId);
    validateSimilarityType(similarityType);

    // Sanitize root ID
    const cleanRootId = sanitizeInput(rootId);

    try {
      // Get all roots to compare against
      const allRoots = await this.apiClient.getAllRoots();
      const allRootIds = [...allRoots.roots.hebrew, ...allRoots.roots.taatik];

      // Get the reference root's details for meaning-based similarity
      let referenceRoot: ConjugationResponse | null = null;
      if (similarityType === 'meaning') {
        try {
          referenceRoot = await this.apiClient.getConjugation(cleanRootId);
        } catch {
          // If we can't get the reference root details, fall back to pattern matching
        }
      }

      // Find similar roots based on the specified type
      const similarities: SimilarRoot[] = [];

      for (const candidateRootId of allRootIds) {
        // Skip the root itself
        if (candidateRootId === cleanRootId) {
          continue;
        }

        const similarity = await this.calculateSimilarity(
          cleanRootId,
          candidateRootId,
          similarityType,
          referenceRoot
        );

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

    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to find similar roots: ${error.message}`);
      }
      throw new Error('Failed to find similar roots: Unknown error');
    }
  }

  private async calculateSimilarity(
    rootId: string,
    candidateId: string,
    type: SimilarityType,
    referenceRoot: ConjugationResponse | null
  ): Promise<{ score: number; reason: string }> {
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

  private calculatePatternSimilarity(rootId: string, candidateId: string): { score: number; reason: string } {
    const rootPattern = extractRootPattern(rootId);
    const candidatePattern = extractRootPattern(candidateId);

    // Check if patterns have similar structure
    if (haveSimilarPattern(rootId, candidateId)) {
      const similarity = calculateSimilarity(rootPattern, candidatePattern);
      return {
        score: similarity,
        reason: `Similar root pattern: ${rootPattern} ~ ${candidatePattern}`
      };
    }

    // Check for same root family (same number of letters)
    if (rootPattern.length === candidatePattern.length) {
      const similarity = calculateSimilarity(rootPattern, candidatePattern);
      if (similarity > 0.4) {
        return {
          score: similarity * 0.8, // Slightly lower score for pattern similarity
          reason: `Same root structure (${rootPattern.length} letters)`
        };
      }
    }

    return { score: 0, reason: 'Different pattern' };
  }

  private async calculateMeaningSimilarity(
    rootId: string,
    candidateId: string,
    referenceRoot: ConjugationResponse | null
  ): Promise<{ score: number; reason: string }> {
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
          const similarity = calculateSimilarity(
            refMeaning.toLowerCase(),
            candMeaning.toLowerCase()
          );
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
      
    } catch {
      return { score: 0, reason: 'Could not compare meanings' };
    }
  }

  private calculatePhoneticSimilarity(rootId: string, candidateId: string): { score: number; reason: string } {
    // Extract root patterns for phonetic comparison
    const rootPattern = extractRootPattern(rootId);
    const candidatePattern = extractRootPattern(candidateId);

    // Simple phonetic similarity based on character similarity
    const similarity = calculateSimilarity(rootPattern, candidatePattern);

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