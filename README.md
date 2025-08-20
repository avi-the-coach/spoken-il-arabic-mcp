# Spoken IL Arabic MCP Server

An MCP (Model Context Protocol) server that provides access to Arabic Palestinian conjugation and dictionary lookup through the roadtorecovery.org.il/Spokenarabic API.

## Features

- 🔍 **Search Arabic Roots**: Find roots by Hebrew meaning, Arabic transliteration, or root patterns
- 📚 **Full Conjugations**: Get complete conjugation tables with all verb forms  
- 🔄 **Similar Roots**: Discover related roots by pattern, meaning, or phonetic similarity
- 🌐 **Hebrew/Arabic Support**: Proper handling of bidirectional text and UTF-8 encoding
- ⚡ **Fast & Reliable**: Built with TypeScript for robust error handling

## Installation

```bash
npm install -g spoken-il-arabic-mcp
```

## Usage with Claude

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "spoken-arabic": {
      "command": "spoken-il-arabic-mcp"
    }
  }
}
```

## Enhanced Usage Instructions

For an enhanced user experience with formatted Arabic root pages and better data presentation, see the [Claude Desktop Project Instructions](./claude-desktop-project-instructions.md). This file contains detailed guidelines for:

- Creating beautifully formatted HTML pages for Arabic roots
- Processing MCP data into user-friendly presentations  
- Step-by-step workflows for Hebrew-to-Arabic root lookups
- Custom CSS templates and styling guidelines

These instructions help Claude Desktop (or any MCP-supporting client) transform raw conjugation data into polished, educational content.

**Note:** Copy the contents of this instructions file into the instruction section of your favorite AI client for optimal results.

## Available Tools

### 1. search_arabic_roots

Search for Arabic roots by various criteria.

**Parameters:**
- `search_term` (string, required): The term to search for
- `search_type` (string, optional): "auto", "hebrew", or "arabic" (default: "auto")
- `limit` (number, optional): Maximum results (default: 10, max: 100)

**Example:**
```json
{
  "search_term": "ללכת",
  "search_type": "hebrew",
  "limit": 5
}
```

### 2. get_root_conjugation

Get complete conjugation data for a specific root.

**Parameters:**
- `root_id` (string, required): Exact root ID from search results
- `include_audio` (boolean, optional): Include audio info (default: true)
- `include_examples` (boolean, optional): Include example sentences (default: true)
- `include_negation` (boolean, optional): Include negation forms (default: false)

**Example:**
```json
{
  "root_id": "ללכת - רוח, פעל 1",
  "include_examples": true
}
```

### 3. get_similar_roots

Find roots similar to a reference root.

**Parameters:**
- `root_id` (string, required): Reference root ID
- `similarity_type` (string, required): "pattern", "meaning", or "phonetic"
- `limit` (number, optional): Maximum results (default: 10, max: 50)

**Example:**
```json
{
  "root_id": "ללכת - רוח, פעל 1",
  "similarity_type": "pattern",
  "limit": 10
}
```

## API Details

### Data Source
- **API**: `https://amir-325409.oa.r.appspot.com`
- **Source**: roadtorecovery.org.il/Spokenarabic
- **Coverage**: 2,930+ Hebrew roots, 4,336+ Arabic transliterations

### Root ID Format
Root IDs must match exactly as returned by the search API:
- Hebrew format: `"ללכת - רוח, פעל 1"`
- Arabic format: `"ra7"`, `"roo7"`

## Example Interactions

### Searching for Roots
```
User: "Find Arabic roots related to walking"
Claude uses: search_arabic_roots("ללכת", "hebrew", 5)
Result: ["ללכת - רוח, פעל 1", "ללכת - משא, פעל 1", ...]
```

### Getting Conjugations
```
User: "Show me conjugations for the root ללכת - רוח, פעל 1"
Claude uses: get_root_conjugation("ללכת - רוח, פעל 1")
Result: Complete conjugation table with all persons and tenses
```

### Finding Similar Roots
```
User: "Find roots with similar patterns to ללכת - רוח, פעל 1"
Claude uses: get_similar_roots("ללכת - רוח, פعל 1", "pattern")
Result: Roots with similar structure and patterns
```

## Development

### Prerequisites
- Node.js ≥ 18.0.0
- TypeScript ≥ 5.0.0

### Setup
```bash
git clone https://github.com/avi-the-coach/spoken-il-arabic-mcp.git
cd spoken-il-arabic-mcp
npm install
npm run build
```

### Scripts
- `npm run build`: Compile TypeScript to JavaScript
- `npm run dev`: Run in development mode with auto-reload
- `npm start`: Run the compiled server

### Project Structure
```
src/
├── index.ts          # Entry point
├── server.ts         # MCP server implementation  
├── api/
│   └── client.ts     # API client for roadtorecovery
├── tools/
│   ├── search.ts     # Search functionality
│   ├── conjugate.ts  # Conjugation retrieval
│   └── similar.ts    # Similar roots finding
├── types/
│   └── api.ts        # TypeScript interfaces
└── utils/
    ├── formatter.ts  # Text processing utilities
    └── validator.ts  # Input validation
```

## Error Handling

The server includes comprehensive error handling for:
- Invalid input parameters
- Network connectivity issues
- API response errors
- Rate limiting and timeouts
- Hebrew/Arabic encoding problems

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **API Source**: [roadtorecovery.org.il/Spokenarabic](https://roadtorecovery.org.il/Spokenarabic) - Arabic Palestinian dialect resources
- **Research & Development**: Claude (Anthropic) in collaboration with Avi Bechar
- **Language Data**: Arabic Palestinian dialect conjugation database

## Support

For issues and feature requests, please use the [GitHub Issues](https://github.com/avi-the-coach/spoken-il-arabic-mcp/issues) page.

---

*Made with ❤️ for Arabic language learners*