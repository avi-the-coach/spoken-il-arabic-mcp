import { SearchType, SimilarityType } from '../types/api.js';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validateSearchTerm(term: string): void {
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

export function validateSearchType(type: SearchType): void {
  const validTypes: SearchType[] = ['auto', 'hebrew', 'arabic'];
  if (!validTypes.includes(type)) {
    throw new ValidationError(`Invalid search type. Must be one of: ${validTypes.join(', ')}`);
  }
}

export function validateLimit(limit: number): void {
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new ValidationError('Limit must be an integer between 1 and 100');
  }
}

export function validateRootId(rootId: string): void {
  if (!rootId || typeof rootId !== 'string') {
    throw new ValidationError('Root ID is required and must be a non-empty string');
  }
  
  if (rootId.trim().length === 0) {
    throw new ValidationError('Root ID cannot be empty or whitespace only');
  }
}

export function validateSimilarityType(type: SimilarityType): void {
  const validTypes: SimilarityType[] = ['pattern', 'meaning', 'phonetic'];
  if (!validTypes.includes(type)) {
    throw new ValidationError(`Invalid similarity type. Must be one of: ${validTypes.join(', ')}`);
  }
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[\x00-\x1F\x7F]/g, ''); // Remove control characters
}