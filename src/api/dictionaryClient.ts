/**
 * HTTP client for milon.madrasafree.com dictionary API
 */

import { 
  DictionarySearchResponse, 
  DictionaryWordDetails 
} from '../types/api.js';

const BASE_URL = 'https://milon.madrasafree.com';
const SEARCH_ENDPOINT = '/?searchString=';
const WORD_ENDPOINT = '/word.asp?id=';

/**
 * Dictionary API client class
 */
export class DictionaryClient {
  private baseUrl: string;

  constructor(baseUrl = BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Search for dictionary entries
   * @param searchTerm - The term to search for
   * @returns Promise<string> - Raw HTML response
   */
  async searchWords(searchTerm: string): Promise<string> {
    const url = `${this.baseUrl}${SEARCH_ENDPOINT}${encodeURIComponent(searchTerm)}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; MCP-Arabic-Dictionary/1.0)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'he,en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
        },
        // Add timeout
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (!response.ok) {
        throw new ApiError(`HTTP error! status: ${response.status}`, response.status);
      }

      const html = await response.text();
      
      if (!html || html.trim().length === 0) {
        throw new ApiError('Empty response from dictionary API');
      }

      return html;

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Handle network errors, timeouts, etc.
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new ApiError(`Failed to search dictionary: ${message}`);
    }
  }

  /**
   * Get detailed information for a specific word
   * @param wordId - Unique word identifier
   * @returns Promise<string> - Raw HTML response
   */
  async getWordDetails(wordId: number): Promise<string> {
    const url = `${this.baseUrl}${WORD_ENDPOINT}${wordId}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; MCP-Arabic-Dictionary/1.0)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'he,en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
        },
        // Add timeout
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new ApiError(`Word with ID ${wordId} not found`, 404, 'WORD_NOT_FOUND');
        }
        throw new ApiError(`HTTP error! status: ${response.status}`, response.status);
      }

      const html = await response.text();
      
      if (!html || html.trim().length === 0) {
        throw new ApiError(`Empty response for word ID ${wordId}`);
      }

      return html;

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Handle network errors, timeouts, etc.
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new ApiError(`Failed to get word details: ${message}`);
    }
  }

  /**
   * Health check for the dictionary API
   * @returns Promise<boolean> - API availability status
   */
  async healthCheck(): Promise<boolean> {
    try {
      // Try a simple search to verify API is working
      const html = await this.searchWords('test');
      return html.includes('milon') || html.includes('מילון'); // Basic content check
    } catch (error) {
      console.error('Dictionary API health check failed:', error);
      return false;
    }
  }
}

// Export a default instance
export const dictionaryClient = new DictionaryClient();

// Custom error class for API-specific errors
class ApiError extends Error {
  constructor(message: string, public status?: number, public code?: string) {
    super(message);
    this.name = 'ApiError';
  }
}