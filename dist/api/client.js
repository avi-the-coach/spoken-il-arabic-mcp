"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoadToRecoveryApiClient = void 0;
class RoadToRecoveryApiClient {
    baseUrl = 'https://amir-325409.oa.r.appspot.com';
    timeout = 10000; // 10 seconds
    async fetchWithTimeout(url, options = {}) {
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
        }
        catch (error) {
            clearTimeout(timeoutId);
            if (error instanceof Error && error.name === 'AbortError') {
                throw new Error(`Request timeout after ${this.timeout}ms`);
            }
            throw error;
        }
    }
    async handleApiError(response) {
        const error = {
            message: `API request failed with status ${response.status}`,
            status: response.status,
        };
        try {
            const errorBody = await response.text();
            if (errorBody) {
                error.message += `: ${errorBody}`;
            }
        }
        catch {
            // Ignore error parsing error body
        }
        throw new Error(error.message);
    }
    /**
     * Get all roots from the API
     */
    async getAllRoots() {
        try {
            const response = await this.fetchWithTimeout(`${this.baseUrl}/all`);
            if (!response.ok) {
                await this.handleApiError(response);
            }
            const data = await response.json();
            return data;
        }
        catch (error) {
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
    async getConjugation(rootId) {
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
            return data;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to fetch conjugation for "${rootId}": ${error.message}`);
            }
            throw new Error(`Failed to fetch conjugation for "${rootId}": Unknown error`);
        }
    }
    /**
     * Check if the API is accessible
     */
    async healthCheck() {
        try {
            const response = await this.fetchWithTimeout(`${this.baseUrl}/all`);
            return response.ok;
        }
        catch {
            return false;
        }
    }
}
exports.RoadToRecoveryApiClient = RoadToRecoveryApiClient;
//# sourceMappingURL=client.js.map