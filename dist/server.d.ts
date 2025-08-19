export declare class SpokenArabicMCPServer {
    private server;
    private apiClient;
    private searchTool;
    private conjugationTool;
    private similarRootsTool;
    constructor();
    private setupToolHandlers;
    private handleSearchArabicRoots;
    private handleGetRootConjugation;
    private handleGetSimilarRoots;
    run(): Promise<void>;
}
//# sourceMappingURL=server.d.ts.map