# Instructions for Claude Code

## 🎯 Mission

You are tasked with implementing a **complete MCP Server** for Arabic Palestinian conjugation and dictionary lookup. This is a **real-world project** that will be published as open source on GitHub.

## 📋 Your Task

1. **READ** the `SPECIFICATION.md` file in this directory - it contains the complete technical specification
2. **ANALYZE** the requirements and API details provided
3. **PLAN** your implementation approach step by step
4. **IMPLEMENT** the full MCP server according to the specification

## 🔗 Key Information

- **Repository**: https://github.com/avi-the-coach/spoken-il-arabic-mcp
- **API Base**: `https://amir-325409.oa.r.appspot.com`
- **Target**: 3 MCP tools for Arabic root search and conjugation
- **Tech Stack**: TypeScript, Node.js, MCP SDK

## 📊 API Details (Tested & Verified)

The specification contains **real API responses** that have been tested. For example:
- `/all` returns root lists in Hebrew and Arabic transliteration
- `/hataiotv2/{root_id}` returns full conjugation data
- Root IDs must be **exact matches** from the search results (e.g., "ללכת - רוח, פעל 1")

## 🛠️ Required Tools

1. **search_arabic_roots** - Search roots by Hebrew/Arabic terms
2. **get_root_conjugation** - Get full conjugation tables  
3. **get_similar_roots** - Find similar roots by pattern

## 📝 Implementation Guidelines

### Before You Start:
1. Read the specification thoroughly
2. Understand the API structure and response formats
3. Plan your file structure and implementation approach
4. Set up the TypeScript project with proper dependencies

### Development Process:
1. **Project Setup**: Create package.json, tsconfig.json, etc.
2. **API Client**: Implement the HTTP client for the roadtorecovery API
3. **Type Definitions**: Create TypeScript interfaces for API responses
4. **MCP Tools**: Implement each of the 3 required tools
5. **Error Handling**: Robust error handling for API failures
6. **Testing**: Verify tools work with real API calls
7. **Documentation**: Update README with usage instructions

### Technical Requirements:
- Use the official `@modelcontextprotocol/sdk`
- Implement proper TypeScript types
- Handle Hebrew/Arabic text encoding correctly
- Include comprehensive error handling
- Return structured data (not formatted output - Claude will handle display)

## ⚠️ Important Notes

- **Data Only**: Your MCP server should return raw data. Claude (the AI) will handle formatting and display
- **Real API**: This connects to a live API - be respectful with requests
- **Hebrew/Arabic**: Handle bidirectional text and UTF-8 encoding properly
- **Exact Matching**: Root IDs must match exactly as returned by the search API

## 🎯 Success Criteria

The project is successful when:
- All 3 MCP tools work correctly
- Can search for Arabic roots reliably
- Returns complete conjugation data
- Proper error handling for edge cases
- Can be installed and used by Claude

## 🚀 Getting Started

1. **First**: Read `SPECIFICATION.md` completely
2. **Then**: Create your implementation plan
3. **Finally**: Start building the MCP server

**Good luck! This is an exciting project that will help people learn Arabic Palestinian dialect.**

---

*This project was researched and specified by Claude (Anthropic) in collaboration with Avi Bechar.*