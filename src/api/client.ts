import { AllRootsResponse, ConjugationResponse, ApiError } from '../types/api.js';

export class RoadToRecoveryApiClient {
  private readonly baseUrl = 'https://amir-325409.oa.r.appspot.com';
  private readonly timeout = 10000; // 10 seconds

  private async fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'spoken-il-arabic-mcp/1.0.0',
          ...options.headers,
        },
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timeout after ${this.timeout}ms`);
      }
      throw error;
    }
  }

  private async handleApiError(response: Response): Promise<never> {
    const error: ApiError = {
      message: `API request failed with status ${response.status}`,
      status: response.status,
    };

    try {
      const errorBody = await response.text();
      if (errorBody) {
        error.message += `: ${errorBody}`;
      }
    } catch {
      // Ignore error parsing error body
    }

    throw new Error(error.message);
  }

  /**
   * Get all roots from the API
   */
  async getAllRoots(): Promise<AllRootsResponse> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseUrl}/all`);
      
      if (!response.ok) {
        await this.handleApiError(response);
      }

      const data = await response.json();
      return data as AllRootsResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch all roots: ${error.message}`);
      }
      throw new Error('Failed to fetch all roots: Unknown error');
    }
  }

  /**
   * Get conjugation details for a specific root
   * @param rootId The exact root ID as returned from the search
   */
  async getConjugation(rootId: string): Promise<ConjugationResponse> {
    try {
      // URL encode the root ID to handle Hebrew/Arabic characters and spaces
      const encodedRootId = encodeURIComponent(rootId);
      const url = `${this.baseUrl}/hataiotv2/${encodedRootId}`;
      
      const response = await this.fetchWithTimeout(url);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Root not found: ${rootId}`);
        }
        await this.handleApiError(response);
      }

      const data = await response.json();
      return data as ConjugationResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch conjugation for "${rootId}": ${error.message}`);
      }
      throw new Error(`Failed to fetch conjugation for "${rootId}": Unknown error`);
    }
  }

  /**
   * Check if the API is accessible
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseUrl}/all`);
      return response.ok;
    } catch {
      return false;
    }
  }
}