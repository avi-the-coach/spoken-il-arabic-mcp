import { RoadToRecoveryApiClient } from '../api/client.js';
import { ConjugationResponse } from '../types/api.js';
import { validateRootId, sanitizeInput } from '../utils/validator.js';
import { formatRootPage } from '../utils/htmlFormatter.js';

export interface ConjugationOptions {
  includeAudio?: boolean;
  includeExamples?: boolean;
  includeNegation?: boolean;
}

export interface ConjugationWithHtml {
  conjugation: ConjugationResponse;
  formatted_html: string;
}

export class ConjugationTool {
  private apiClient: RoadToRecoveryApiClient;

  constructor(apiClient: RoadToRecoveryApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Get full conjugation table for a specific root with HTML formatting
   */
  async getRootConjugation(
    rootId: string,
    options: ConjugationOptions = {}
  ): Promise<ConjugationWithHtml> {
    // Validate inputs
    validateRootId(rootId);

    // Sanitize root ID
    const cleanRootId = sanitizeInput(rootId);

    // Set default options
    const opts: Required<ConjugationOptions> = {
      includeAudio: options.includeAudio ?? true,
      includeExamples: options.includeExamples ?? true,
      includeNegation: options.includeNegation ?? false,
    };

    try {
      // Get conjugation data from API
      const response = await this.apiClient.getConjugation(cleanRootId);
      
      // Filter response based on options
      const filteredResponse: ConjugationResponse = {
        root: response.root,
        audio: opts.includeAudio ? response.audio : {
          root: '',
          binian: '',
          zivoi: '',
          paul: '',
          poal: ''
        },
        sentences: opts.includeExamples ? response.sentences : {
          root: '',
          binian: '',
          sentences: []
        }
      };

      // Add negation forms if requested (this would need additional API support)
      if (opts.includeNegation) {
        // For now, we don't have negation data in the API
        // This could be enhanced in the future
      }

      // Generate HTML formatted page
      const formattedHtml = formatRootPage(filteredResponse);

      return {
        conjugation: filteredResponse,
        formatted_html: formattedHtml
      };
      
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get conjugation: ${error.message}`);
      }
      throw new Error('Failed to get conjugation: Unknown error');
    }
  }

  /**
   * Get simplified conjugation data (just the essential conjugations)
   */
  async getSimpleConjugation(rootId: string): Promise<{
    root: string;
    rootArabic: string;
    meaning: string[];
    conjugations: Array<{
      person: string;
      past: string;
      present: string;
      future: string;
    }>;
  }> {
    const response = await this.getRootConjugation(rootId, {
      includeAudio: false,
      includeExamples: false,
    });

    return {
      root: response.conjugation.root.shoresh,
      rootArabic: response.conjugation.root.shoreshArabic,
      meaning: response.conjugation.root.mashmaut,
      conjugations: response.conjugation.root.hataiot.map((conj: any) => ({
        person: conj.who,
        past: conj.avar || '',
        present: conj.hoveh || '',
        future: conj.atid || '',
      })).filter((conj: any) => conj.past || conj.present || conj.future)
    };
  }

  /**
   * Check if a root ID exists in the system
   */
  async validateRootExists(rootId: string): Promise<boolean> {
    try {
      await this.getRootConjugation(rootId, { 
        includeAudio: false, 
        includeExamples: false 
      });
      return true;
    } catch (error) {
      if (error instanceof Error && error.message.includes('Root not found')) {
        return false;
      }
      // Re-throw other errors (network issues, etc.)
      throw error;
    }
  }
}