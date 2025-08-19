"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpokenArabicMCPServer = void 0;
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const client_js_1 = require("./api/client.js");
const search_js_1 = require("./tools/search.js");
const conjugate_js_1 = require("./tools/conjugate.js");
const similar_js_1 = require("./tools/similar.js");
const validator_js_1 = require("./utils/validator.js");
class SpokenArabicMCPServer {
    server;
    apiClient;
    searchTool;
    conjugationTool;
    similarRootsTool;
    constructor() {
        this.server = new index_js_1.Server({
            name: 'spoken-il-arabic-mcp',
            version: '1.0.0',
            description: 'MCP Server for Arabic Palestinian conjugation and dictionary lookup',
        }, {
            capabilities: {
                tools: {},
            },
        });
        this.apiClient = new client_js_1.RoadToRecoveryApiClient();
        this.searchTool = new search_js_1.SearchTool(this.apiClient);
        this.conjugationTool = new conjugate_js_1.ConjugationTool(this.apiClient);
        this.similarRootsTool = new similar_js_1.SimilarRootsTool(this.apiClient);
        this.setupToolHandlers();
    }
    setupToolHandlers() {
        // List available tools
        this.server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
            return {
                tools: [
                    {
                        name: 'search_arabic_roots',
                        description: 'Search for Arabic Palestinian roots by Hebrew meaning, Arabic transliteration, or root pattern',
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
                ],
            };
        });
        // Handle tool calls
        this.server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
            try {
                const { name, arguments: args } = request.params;
                switch (name) {
                    case 'search_arabic_roots':
                        return await this.handleSearchArabicRoots(args);
                    case 'get_root_conjugation':
                        return await this.handleGetRootConjugation(args);
                    case 'get_similar_roots':
                        return await this.handleGetSimilarRoots(args);
                    default:
                        throw new types_js_1.McpError(types_js_1.ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
                }
            }
            catch (error) {
                if (error instanceof validator_js_1.ValidationError) {
                    throw new types_js_1.McpError(types_js_1.ErrorCode.InvalidParams, error.message);
                }
                if (error instanceof types_js_1.McpError) {
                    throw error;
                }
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                throw new types_js_1.McpError(types_js_1.ErrorCode.InternalError, errorMessage);
            }
        });
    }
    async handleSearchArabicRoots(args) {
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
    async handleGetRootConjugation(args) {
        const { root_id, include_audio = true, include_examples = true, include_negation = false } = args;
        const conjugation = await this.conjugationTool.getRootConjugation(root_id, {
            includeAudio: include_audio,
            includeExamples: include_examples,
            includeNegation: include_negation,
        });
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({ conjugation }, null, 2),
                },
            ],
        };
    }
    async handleGetSimilarRoots(args) {
        const { root_id, similarity_type, limit = 10 } = args;
        const similarRoots = await this.similarRootsTool.getSimilarRoots(root_id, similarity_type, limit);
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({ similarRoots }, null, 2),
                },
            ],
        };
    }
    async run() {
        const transport = new stdio_js_1.StdioServerTransport();
        await this.server.connect(transport);
    }
}
exports.SpokenArabicMCPServer = SpokenArabicMCPServer;
//# sourceMappingURL=server.js.map