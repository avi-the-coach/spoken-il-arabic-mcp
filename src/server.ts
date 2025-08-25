import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

import { RoadToRecoveryApiClient } from './api/client.js';
import { SearchTool } from './tools/search.js';
import { ConjugationTool } from './tools/conjugate.js';
import { SimilarRootsTool } from './tools/similar.js';
import { searchDictionaryTool, handleSearchDictionary } from './tools/dictionarySearch.js';
import { getDictionaryWordTool, handleGetDictionaryWord } from './tools/dictionaryWord.js';
import { ValidationError } from './utils/validator.js';

export class SpokenArabicMCPServer {
  private server: Server;
  private apiClient: RoadToRecoveryApiClient;
  private searchTool: SearchTool;
  private conjugationTool: ConjugationTool;
  private similarRootsTool: SimilarRootsTool;

  constructor() {
    this.server = new Server(
      {
        name: 'spoken-il-arabic-mcp',
        version: '1.0.0',
        description: 'MCP Server for Arabic Palestinian conjugation and dictionary lookup',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.apiClient = new RoadToRecoveryApiClient();
    this.searchTool = new SearchTool(this.apiClient);
    this.conjugationTool = new ConjugationTool(this.apiClient);
    this.similarRootsTool = new SimilarRootsTool(this.apiClient);

    this.setupToolHandlers();
  }

  private setupToolHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'search_arabic_verbs',
            description: 'Search for Arabic Palestinian verb roots and their conjugations by Hebrew meaning, Arabic transliteration, or root pattern',
            inputSchema: {
              type: 'object',
              properties: {
                search_term: {
                  type: 'string',
                  description: 'The term to search for (Hebrew meaning, Arabic transliteration, or root pattern)',
                },
                search_type: {
                  type: 'string',
                  enum: ['auto', 'hebrew', 'arabic'],
                  default: 'auto',
                  description: 'Type of search: auto (detect), hebrew (search Hebrew meanings), or arabic (search Arabic transliteration)',
                },
                limit: {
                  type: 'number',
                  default: 10,
                  minimum: 1,
                  maximum: 100,
                  description: 'Maximum number of results to return',
                },
              },
              required: ['search_term'],
            },
          },
          {
            name: 'get_root_conjugation',
            description: 'Get complete conjugation table for a specific Arabic root',
            inputSchema: {
              type: 'object',
              properties: {
                root_id: {
                  type: 'string',
                  description: 'The exact root ID as returned from search (e.g., "ללכת - רוח, פעל 1")',
                },
                include_audio: {
                  type: 'boolean',
                  default: true,
                  description: 'Include audio information',
                },
                include_examples: {
                  type: 'boolean',
                  default: true,
                  description: 'Include example sentences',
                },
                include_negation: {
                  type: 'boolean',
                  default: false,
                  description: 'Include negation forms (if available)',
                },
              },
              required: ['root_id'],
            },
          },
          {
            name: 'get_similar_roots',
            description: 'Find roots similar to a given root based on pattern, meaning, or phonetic similarity',
            inputSchema: {
              type: 'object',
              properties: {
                root_id: {
                  type: 'string',
                  description: 'The reference root ID to find similar roots for',
                },
                similarity_type: {
                  type: 'string',
                  enum: ['pattern', 'meaning', 'phonetic'],
                  description: 'Type of similarity: pattern (root structure), meaning (semantic), or phonetic (sound)',
                },
                limit: {
                  type: 'number',
                  default: 10,
                  minimum: 1,
                  maximum: 50,
                  description: 'Maximum number of similar roots to return',
                },
              },
              required: ['root_id', 'similarity_type'],
            },
          },
          searchDictionaryTool,
          getDictionaryWordTool,
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const { name, arguments: args } = request.params;

        switch (name) {
          case 'search_arabic_verbs':
          case 'search_arabic_roots': // Backward compatibility
            return await this.handleSearchArabicVerbs(args);

          case 'get_root_conjugation':
            return await this.handleGetRootConjugation(args);

          case 'get_similar_roots':
            return await this.handleGetSimilarRoots(args);

          case 'search_arabic_dictionary':
            return await this.handleSearchDictionary(args);

          case 'get_dictionary_word':
            return await this.handleGetDictionaryWord(args);

          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        if (error instanceof ValidationError) {
          throw new McpError(ErrorCode.InvalidParams, error.message);
        }
        if (error instanceof McpError) {
          throw error;
        }
        
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new McpError(ErrorCode.InternalError, errorMessage);
      }
    });
  }

  private async handleSearchArabicVerbs(args: any) {
    const { search_term, search_type = 'auto', limit = 10 } = args;
    
    const results = await this.searchTool.searchArabicRoots(search_term, search_type, limit);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ results }, null, 2),
        },
      ],
    };
  }

  private async handleGetRootConjugation(args: any) {
    const { 
      root_id, 
      include_audio = true, 
      include_examples = true, 
      include_negation = false 
    } = args;
    
    const result = await this.conjugationTool.getRootConjugation(root_id, {
      includeAudio: include_audio,
      includeExamples: include_examples,
      includeNegation: include_negation,
    });
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async handleGetSimilarRoots(args: any) {
    const { root_id, similarity_type, limit = 10 } = args;
    
    const similarRoots = await this.similarRootsTool.getSimilarRoots(
      root_id,
      similarity_type,
      limit
    );
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ similarRoots }, null, 2),
        },
      ],
    };
  }

  private async handleSearchDictionary(args: any) {
    const searchResults = await handleSearchDictionary(args);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(searchResults, null, 2),
        },
      ],
    };
  }

  private async handleGetDictionaryWord(args: any) {
    const wordDetails = await handleGetDictionaryWord(args);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(wordDetails, null, 2),
        },
      ],
    };
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}