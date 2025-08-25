/**
 * HTML parser utilities for milon.madrasafree.com dictionary responses
 * Extracts structured JSON data from HTML pages
 */

import { 
  DictionarySearchResponse,
  DictionaryWordMatch,
  DictionaryWordDetails,
  DictionaryExample,
  RelatedWord
} from '../types/api.js';

/**
 * Parse search results HTML page
 * @param html - Raw HTML from search endpoint
 * @param query - Original search term
 * @returns Structured search results
 */
export function parseSearchResults(html: string, query: string): DictionarySearchResponse {
  // Initialize response structure
  const response: DictionarySearchResponse = {
    query,
    total_results: 0,
    exact_matches: [],
    soundex_matches: [],
    additional_matches: []
  };

  try {
    // Extract exact matches section
    response.exact_matches = extractMatches(html, 'exact');
    
    // Extract soundex/phonetic matches
    response.soundex_matches = extractMatches(html, 'soundex');
    
    // Extract additional matches
    response.additional_matches = extractMatches(html, 'additional');

    // Calculate total results
    response.total_results = 
      response.exact_matches.length + 
      response.soundex_matches.length + 
      response.additional_matches.length;

    return response;

  } catch (error) {
    console.error('Error parsing search results:', error);
    throw new Error(`Failed to parse search results: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Parse detailed word page HTML
 * @param html - Raw HTML from word detail endpoint
 * @param wordId - Word ID for reference
 * @returns Structured word details
 */
export function parseWordDetails(html: string, wordId: number): DictionaryWordDetails {
  try {
    // Extract basic word information
    const hebrew = extractText(html, /class="[^"]*hebrew[^"]*"[^>]*>([^<]+)/i) || '';
    const arabic = extractText(html, /class="[^"]*arabic[^"]*"[^>]*>([^<]+)/i) || '';
    const transliteration = extractTransliteration(html) || '';
    const phonetic = extractPhonetic(html);
    
    // Extract grammatical information
    const wordType = extractWordType(html) || 'unknown';
    const gender = extractGender(html);
    const number = extractNumber(html);
    const category = extractCategory(html);
    
    // Extract definitions
    const definitions = extractDefinitions(html);
    
    // Extract examples
    const examples = extractExamples(html);
    
    // Extract related words
    const relatedWords = extractRelatedWords(html);
    
    // Extract media indicators
    const hasAudio = html.includes('אודיו') || html.includes('audio') || html.includes('🔊');
    const hasImage = html.includes('תמונה') || html.includes('image') || html.includes('📷');
    const verified = html.includes('נבדק') || html.includes('תקין') || html.includes('✓');

    const wordDetails: DictionaryWordDetails = {
      id: wordId,
      hebrew: hebrew.trim(),
      arabic: arabic.trim(),
      transliteration: transliteration.trim(),
      phonetic,
      word_type: wordType,
      gender,
      number,
      category,
      definitions,
      examples,
      related_words: relatedWords,
      has_audio: hasAudio,
      has_image: hasImage,
      verified
    };

    return wordDetails;

  } catch (error) {
    console.error('Error parsing word details:', error);
    throw new Error(`Failed to parse word details: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Extract matches from specific section of search results
 */
function extractMatches(html: string, matchType: 'exact' | 'soundex' | 'additional'): DictionaryWordMatch[] {
  const matches: DictionaryWordMatch[] = [];
  
  try {
    // Look for result divs containing word.asp?id= links - capture until the end of the complete result
    const resultRegex = /<div class="result"[^>]*onclick[^>]*word\.asp\?id=(\d+)[^>]*>([\s\S]*?)<\/div>\s*<\/div>/gi;
    let match;
    
    while ((match = resultRegex.exec(html)) !== null) {
      const wordId = parseInt(match[1], 10);
      const resultContent = match[2];
      
      // Extract information from the result content
      const wordMatch = parseWordMatchFromResult(resultContent, wordId);
      if (wordMatch) {
        matches.push(wordMatch);
      }
    }

    return matches;
    
  } catch (error) {
    console.error(`Error extracting ${matchType} matches:`, error);
    return [];
  }
}

/**
 * Parse individual word match from result div HTML
 */
function parseWordMatchFromResult(resultHtml: string, wordId: number): DictionaryWordMatch | null {
  try {
    // Extract Hebrew text from .heb div
    const hebrewMatch = resultHtml.match(/<div class="heb"[^>]*>[\s\S]*?<a[^>]*>([^<]+)<\/a>/i);
    const hebrew = hebrewMatch ? hebrewMatch[1].trim() : '';
    
    // Extract Arabic text from .arb divs (first one is usually the Arabic script)
    const arabicMatches = resultHtml.match(/<div class="arb">([^<]+)<\/div>/gi);
    let arabic = '';
    let transliteration = '';
    
    if (arabicMatches && arabicMatches.length > 0) {
      // Identify which div contains actual Arabic script vs Hebrew transliteration
      for (let i = 0; i < arabicMatches.length; i++) {
        const match = arabicMatches[i].match(/<div class="arb">([^<]+)<\/div>/i);
        if (match) {
          const content = match[1].trim();
          
          // Check if this contains Arabic characters (Arabic script)
          if (/[\u0600-\u06FF]/.test(content)) {
            arabic = content;
          }
          // Check if this contains Hebrew characters (transliteration)
          else if (/[\u0590-\u05FF]/.test(content)) {
            transliteration = content;
          }
        }
      }
    }
    
    // Extract phonetic from .eng div
    const phoneticMatch = resultHtml.match(/<div class="eng">\s*([^<]+)/i);
    const phonetic = phoneticMatch ? phoneticMatch[1].trim() : undefined;
    
    // Extract grammatical information from .attr div
    const posMatch = resultHtml.match(/<div class="pos">([^<]+)/i);
    const wordType = posMatch ? posMatch[1].trim() : undefined;
    
    const genderMatch = resultHtml.match(/<div class="gender">([^<]+)/i);
    const gender = genderMatch ? genderMatch[1].trim() : undefined;
    
    const numberMatch = resultHtml.match(/<div class="number">([^<]+)/i);
    const number = numberMatch ? numberMatch[1].trim() : undefined;
    
    // Check for indicators
    const hasAudio = resultHtml.includes('אודיו') || resultHtml.includes('audio');
    const hasImage = resultHtml.includes('תמונה') || resultHtml.includes('image');
    const verified = resultHtml.includes('correct.png') || resultHtml.includes('נבדק ונמצא תקין');

    // Only return if we have at least Hebrew text
    if (!hebrew) {
      return null;
    }

    return {
      id: wordId,
      hebrew,
      arabic,
      transliteration,
      phonetic,
      word_type: wordType,
      gender,
      number,
      has_audio: hasAudio,
      has_image: hasImage,
      verified
    };

  } catch (error) {
    console.error('Error parsing word match from result:', error);
    return null;
  }
}

/**
 * Helper function to extract text using regex
 */
function extractText(html: string, regex: RegExp): string | undefined {
  const match = html.match(regex);
  return match && match[1] ? match[1].trim() : undefined;
}

/**
 * Extract transliteration from word detail page
 */
function extractTransliteration(html: string): string | undefined {
  // Look for transliteration patterns
  const patterns = [
    /transliteration[^>]*>([^<]+)/i,
    /תעתיק[^>]*>([^<]+)/i,
    /\(([^)]*[a-zA-Z][^)]*)\)/
  ];

  for (const pattern of patterns) {
    const result = extractText(html, pattern);
    if (result) return result;
  }

  return undefined;
}

/**
 * Extract phonetic pronunciation
 */
function extractPhonetic(html: string): string | undefined {
  const patterns = [
    /phonetic[^>]*>([^<]+)/i,
    /הגייה[^>]*>([^<]+)/i
  ];

  for (const pattern of patterns) {
    const result = extractText(html, pattern);
    if (result) return result;
  }

  return undefined;
}

/**
 * Extract word type (noun, verb, etc.)
 */
function extractWordType(html: string): string | undefined {
  const patterns = [
    /(?:noun|verb|adjective|adverb)/i,
    /(?:שם עצם|פועל|תואר|תואר הפועל)/,
    /pos[^>]*>([^<]+)/i
  ];

  for (const pattern of patterns) {
    const result = extractText(html, pattern);
    if (result) return result.toLowerCase();
  }

  return undefined;
}

/**
 * Extract grammatical gender
 */
function extractGender(html: string): string | undefined {
  if (html.includes('זכר') || html.includes('masculine')) return 'masculine';
  if (html.includes('נקבה') || html.includes('feminine')) return 'feminine';
  return undefined;
}

/**
 * Extract grammatical number
 */
function extractNumber(html: string): string | undefined {
  if (html.includes('יחיד') || html.includes('singular')) return 'singular';
  if (html.includes('רבים') || html.includes('plural')) return 'plural';
  return undefined;
}

/**
 * Extract semantic category
 */
function extractCategory(html: string): string | undefined {
  const categoryMatch = html.match(/\[([^\]]+)\]/);
  return categoryMatch ? categoryMatch[1] : undefined;
}

/**
 * Extract definitions/meanings
 */
function extractDefinitions(html: string): string[] {
  const definitions: string[] = [];
  
  // Look for definition patterns
  const defPatterns = [
    /definition[^>]*>([^<]+)/gi,
    /משמעות[^>]*>([^<]+)/gi,
    /פירוש[^>]*>([^<]+)/gi
  ];

  defPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      const def = match[1].trim();
      if (def && !definitions.includes(def)) {
        definitions.push(def);
      }
    }
  });

  return definitions.length > 0 ? definitions : ['Definition not available'];
}

/**
 * Extract usage examples
 */
function extractExamples(html: string): DictionaryExample[] {
  const examples: DictionaryExample[] = [];
  
  try {
    // Look for example patterns in the HTML
    // This is a simplified version - actual implementation would need
    // to parse the specific structure of the milon website
    
    return examples;
  } catch (error) {
    console.error('Error extracting examples:', error);
    return [];
  }
}

/**
 * Extract related words
 */
function extractRelatedWords(html: string): RelatedWord[] {
  const relatedWords: RelatedWord[] = [];
  
  try {
    // Look for related word patterns
    // This would need to be implemented based on actual HTML structure
    
    return relatedWords;
  } catch (error) {
    console.error('Error extracting related words:', error);
    return [];
  }
}