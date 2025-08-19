"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = void 0;
exports.validateSearchTerm = validateSearchTerm;
exports.validateSearchType = validateSearchType;
exports.validateLimit = validateLimit;
exports.validateRootId = validateRootId;
exports.validateSimilarityType = validateSimilarityType;
exports.sanitizeInput = sanitizeInput;
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}
exports.ValidationError = ValidationError;
function validateSearchTerm(term) {
    if (!term || typeof term !== 'string') {
        throw new ValidationError('Search term is required and must be a non-empty string');
    }
    if (term.trim().length === 0) {
        throw new ValidationError('Search term cannot be empty or whitespace only');
    }
    if (term.length > 100) {
        throw new ValidationError('Search term is too long (maximum 100 characters)');
    }
}
function validateSearchType(type) {
    const validTypes = ['auto', 'hebrew', 'arabic'];
    if (!validTypes.includes(type)) {
        throw new ValidationError(`Invalid search type. Must be one of: ${validTypes.join(', ')}`);
    }
}
function validateLimit(limit) {
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
        throw new ValidationError('Limit must be an integer between 1 and 100');
    }
}
function validateRootId(rootId) {
    if (!rootId || typeof rootId !== 'string') {
        throw new ValidationError('Root ID is required and must be a non-empty string');
    }
    if (rootId.trim().length === 0) {
        throw new ValidationError('Root ID cannot be empty or whitespace only');
    }
}
function validateSimilarityType(type) {
    const validTypes = ['pattern', 'meaning', 'phonetic'];
    if (!validTypes.includes(type)) {
        throw new ValidationError(`Invalid similarity type. Must be one of: ${validTypes.join(', ')}`);
    }
}
function sanitizeInput(input) {
    return input.trim().replace(/[\x00-\x1F\x7F]/g, ''); // Remove control characters
}
//# sourceMappingURL=validator.js.map