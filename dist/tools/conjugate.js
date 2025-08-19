"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConjugationTool = void 0;
const validator_js_1 = require("../utils/validator.js");
class ConjugationTool {
    apiClient;
    constructor(apiClient) {
        this.apiClient = apiClient;
    }
    /**
     * Get full conjugation table for a specific root
     */
    async getRootConjugation(rootId, options = {}) {
        // Validate inputs
        (0, validator_js_1.validateRootId)(rootId);
        // Sanitize root ID
        const cleanRootId = (0, validator_js_1.sanitizeInput)(rootId);
        // Set default options
        const opts = {
            includeAudio: options.includeAudio ?? true,
            includeExamples: options.includeExamples ?? true,
            includeNegation: options.includeNegation ?? false,
        };
        try {
            // Get conjugation data from API
            const response = await this.apiClient.getConjugation(cleanRootId);
            // Filter response based on options
            const filteredResponse = {
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
            return filteredResponse;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to get conjugation: ${error.message}`);
            }
            throw new Error('Failed to get conjugation: Unknown error');
        }
    }
    /**
     * Get simplified conjugation data (just the essential conjugations)
     */
    async getSimpleConjugation(rootId) {
        const response = await this.getRootConjugation(rootId, {
            includeAudio: false,
            includeExamples: false,
        });
        return {
            root: response.root.shoresh,
            rootArabic: response.root.shoreshArabic,
            meaning: response.root.mashmaut,
            conjugations: response.root.hataiot.map(conj => ({
                person: conj.who,
                past: conj.avar || '',
                present: conj.hoveh || '',
                future: conj.atid || '',
            })).filter(conj => conj.past || conj.present || conj.future)
        };
    }
    /**
     * Check if a root ID exists in the system
     */
    async validateRootExists(rootId) {
        try {
            await this.getRootConjugation(rootId, {
                includeAudio: false,
                includeExamples: false
            });
            return true;
        }
        catch (error) {
            if (error instanceof Error && error.message.includes('Root not found')) {
                return false;
            }
            // Re-throw other errors (network issues, etc.)
            throw error;
        }
    }
}
exports.ConjugationTool = ConjugationTool;
//# sourceMappingURL=conjugate.js.map