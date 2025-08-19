#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_js_1 = require("./server.js");
async function main() {
    const server = new server_js_1.SpokenArabicMCPServer();
    // Handle process signals gracefully
    process.on('SIGINT', () => {
        console.error('Received SIGINT, shutting down gracefully...');
        process.exit(0);
    });
    process.on('SIGTERM', () => {
        console.error('Received SIGTERM, shutting down gracefully...');
        process.exit(0);
    });
    try {
        await server.run();
    }
    catch (error) {
        console.error('Failed to start MCP server:', error);
        process.exit(1);
    }
}
// Run the server
main().catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map