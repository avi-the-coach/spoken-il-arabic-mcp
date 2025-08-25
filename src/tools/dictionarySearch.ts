/**
 * MCP tool for searching Arabic dictionary entries
 * Returns structured JSON data from milon.madrasafree.com
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { dictionaryClient } from '../api/dictionaryClient.js';
import { parseSearchResults } from '../utils/dictionaryParser.js';
import { DictionarySearchResponse } from '../types/api.js';

export const searchDictionaryTool: Tool = {
  name: 'search_arabic_dictionary',
  description: 'Search for Arabic words in the general dictionary (not verb conjugations). Returns structured JSON data with Hebrew-Arabic translations, transliterations, and grammatical information.',
  inputSchema: {
    type: 'object',
    properties: {
      search_term: {
        type: 'string',
        description: 'The Hebrew or Arabic word to search for (e.g. "שולחן", "מכונית")'
      },
      limit: {
        type: 'number',
        description: 'Maximum number of results to return per category (default: 10)',
        default: 10,
        minimum: 1,
        maximum: 50
      }
    },
    required: ['search_term']
  }
};

export async function handleSearchDictionary(args: any): Promise<DictionarySearchResponse> {
  try {
    const { search_term, limit = 10 } = args;
    
    if (!search_term || typeof search_term !== 'string' || search_term.trim().length === 0) {
      throw new Error('search_term is required and must be a non-empty string');
    }

    const cleanTerm = search_term.trim();
    
    // Fetch raw HTML from dictionary API
    const html = await dictionaryClient.searchWords(cleanTerm);
    
    // Parse HTML into structured data
    const searchResults = parseSearchResults(html, cleanTerm);
    
    // Apply limit to results
    const limitedResults: DictionarySearchResponse = {
      query: searchResults.query,
      total_results: searchResults.total_results,
      exact_matches: searchResults.exact_matches.slice(0, limit),
      soundex_matches: searchResults.soundex_matches.slice(0, limit),
      additional_matches: searchResults.additional_matches.slice(0, limit)
    };

    return limitedResults;

  } catch (error) {
    // Log the full error for debugging
    console.error('Dictionary search error:', error);
    
    // Return user-friendly error message
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to search dictionary for "${args.search_term}": ${message}`);
  }
}