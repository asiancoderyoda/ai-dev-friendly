interface UnifiedRetrievalMatch {
    name: string;
    filePath: string;
    type: string;
    summary: string;
    score?: number;
}

interface RetrievalContextResult {
    relevantFiles: Array<{
        path: string;
        content: string;
        summary: string;
    }>;
    architecturalPatterns: string[];
    relatedTests: string[];
}

export type {
    UnifiedRetrievalMatch,
    RetrievalContextResult
}