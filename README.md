# Spoken IL Arabic MCP Server

A comprehensive MCP (Model Context Protocol) server that provides access to both Arabic Palestinian verb conjugations and general Arabic dictionary lookup. Features dual API integration for complete Arabic language support.

## Features

### Verb Conjugations (roadtorecovery.org.il API)
- 🔍 **Search Arabic Verbs**: Find verb roots by Hebrew meaning, Arabic transliteration, or patterns
- 📚 **Full Conjugations**: Get complete conjugation tables with all verb forms  
- 🔄 **Similar Roots**: Discover related verb roots by pattern, meaning, or phonetic similarity

### General Dictionary (milon.madrasafree.com API)
- 📖 **Arabic Dictionary**: Search general vocabulary beyond just verbs
- 🔤 **Multi-format Results**: Arabic script, Hebrew transliteration, and phonetic pronunciation
- 🎯 **Smart Matching**: Get both search results and detailed word information
- 🗣️ **Audio Support**: Indicates words with pronunciation recordings available

### Universal Features
- 🎨 **HTML Formatting**: Built-in beautiful HTML page generation with RTL support
- 🌐 **Hebrew/Arabic Support**: Proper handling of bidirectional text and UTF-8 encoding
- 📱 **Code Word System**: Use "get search results for" vs "get full data for" to control output
- ⚡ **Fast & Reliable**: Built with TypeScript for robust error handling

## Prerequisites

- **Node.js** ≥ 18.0.0
- **npm** (included with Node.js)
- **AI Client** supporting MCP (such as Claude Desktop)

## Installation

```bash
npm install -g spoken-il-arabic-mcp
```

## Usage with Claude Desktop

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

## HTML Formatting Feature

This MCP server includes built-in HTML formatting capabilities that automatically generate beautifully styled Arabic root pages. When used with AI clients like Claude Desktop, the server can produce:

- 🎯 **Complete Root Pages**: Hebrew/Arabic roots with full conjugation tables
- 📊 **Verb Forms**: All 6 verb forms (poel/paul in male/female/plural)  
- 🌐 **RTL Support**: Proper right-to-left Arabic text rendering
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🎨 **Clean Styling**: Professional layout with subtle purple accents

Simply ask your AI client to "create an HTML page for [Hebrew word]" and the server will handle the complete workflow from search to formatted output.

### Code Word Control System
Use specific phrases to control the response type:
- **"get search results for [word]"** → Returns search results list only
- **"get full data for [word]"** → Returns complete detailed information

## Available Tools (5 Total)

### Verb Conjugation Tools

#### 1. search_arabic_verbs (formerly search_arabic_roots)

Search for Arabic verb roots by various criteria.

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

#### 2. get_root_conjugation

Get complete conjugation data for a specific verb root.

**Parameters:**
- `root_id` (string, required): Exact root ID from search results
- `include_audio` (boolean, optional): Include audio info (default: true)
- `include_examples` (boolean, optional): Include example sentences (default: true)
- `include_negation` (boolean, optional): Include negation forms (default: false)

**Example:**
```json
{
  "root_id": "ללכת - רוח, פעل 1",
  "include_examples": true
}
```

#### 3. get_similar_roots

Find verb roots similar to a reference root.

**Parameters:**
- `root_id` (string, required): Reference root ID
- `similarity_type` (string, required): "pattern", "meaning", or "phonetic"
- `limit` (number, optional): Maximum results (default: 10, max: 50)

**Example:**
```json
{
  "root_id": "ללכת - רוח, פعל 1",
  "similarity_type": "pattern",
  "limit": 10
}
```

### Dictionary Tools

#### 4. search_arabic_dictionary

Search for general Arabic vocabulary (not just verbs).

**Parameters:**
- `search_term` (string, required): Hebrew or Arabic word to search for
- `limit` (number, optional): Maximum results (default: 20, max: 100)

**Example:**
```json
{
  "search_term": "שולחן",
  "limit": 15
}
```

**Returns:**
- `exact_matches`: Direct word matches
- `soundex_matches`: Phonetically similar words  
- `additional_matches`: Other related results
- Each match includes: Arabic script, Hebrew transliteration, phonetics, word type, gender

#### 5. get_dictionary_word

Get detailed information for a specific dictionary word by ID.

**Parameters:**
- `word_id` (number, required): Word ID from search results

**Example:**
```json
{
  "word_id": 1464
}
```

**Returns:**
- Complete word details with examples
- Related words and usage information
- Audio and image availability indicators

## API Details

### Data Sources

#### Verb Conjugation API
- **API**: `https://amir-325409.oa.r.appspot.com`
- **Source**: roadtorecovery.org.il/Spokenarabic
- **Coverage**: 2,930+ Hebrew roots, 4,336+ Arabic transliterations
- **Root ID Format**: Must match exactly as returned (e.g., `"ללכת - רוח, פעל 1"`)

#### Dictionary API  
- **API**: `https://milon.madrasafree.com`
- **Coverage**: Comprehensive Arabic-Hebrew vocabulary
- **Features**: Arabic script, Hebrew transliteration, phonetic pronunciation
- **Word IDs**: Numeric identifiers for detailed lookups

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
│   ├── client.ts           # API client for roadtorecovery
│   └── dictionaryClient.ts # API client for milon dictionary
├── tools/
│   ├── search.ts           # Verb search functionality
│   ├── conjugate.ts        # Conjugation retrieval
│   ├── similar.ts          # Similar roots finding
│   ├── dictionarySearch.ts # Dictionary search
│   └── dictionaryWord.ts   # Dictionary word details
├── types/
│   └── api.ts        # TypeScript interfaces for both APIs
└── utils/
    ├── formatter.ts        # Text processing utilities
    ├── htmlFormatter.ts    # HTML page generation
    ├── dictionaryParser.ts # HTML parser for dictionary
    └── validator.ts        # Input validation
docs/
└── examples/         # HTML examples and debug files
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