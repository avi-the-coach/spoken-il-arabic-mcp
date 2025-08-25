/**
 * MCP tool for getting detailed information about a specific dictionary word
 * Returns structured JSON data from milon.madrasafree.com
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { dictionaryClient } from '../api/dictionaryClient.js';
import { parseWordDetails } from '../utils/dictionaryParser.js';
import { DictionaryWordDetails } from '../types/api.js';

export const getDictionaryWordTool: Tool = {
  name: 'get_dictionary_word',
  description: 'Get detailed information about a specific dictionary word by its ID. Returns comprehensive data including examples, related words, and full linguistic details.',
  inputSchema: {
    type: 'object',
    properties: {
      word_id: {
        type: 'number',
        description: 'The unique numeric ID of the dictionary word (obtained from search results)'
      }
    },
    required: ['word_id']
  }
};

export async function handleGetDictionaryWord(args: any): Promise<DictionaryWordDetails> {
  try {
    const { word_id } = args;
    
    if (!word_id || typeof word_id !== 'number' || word_id <= 0) {
      throw new Error('word_id must be a positive number');
    }

    // Fetch raw HTML from dictionary word detail page
    const html = await dictionaryClient.getWordDetails(word_id);
    
    // Parse HTML into structured data
    const wordDetails = parseWordDetails(html, word_id);

    return wordDetails;

  } catch (error) {
    // Log the full error for debugging
    console.error('Dictionary word details error:', error);
    
    // Return user-friendly error message
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to get word details for ID ${args.word_id}: ${message}`);
  }
}