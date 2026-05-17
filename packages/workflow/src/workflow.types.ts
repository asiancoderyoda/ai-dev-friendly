interface EnhancedDiffResult {
    rawDiff: string;
    hasChanges: boolean;
    stats: {
        changedFilesCount: number;
        insertions: number;
        deletions: number;
    };
}

export {
    EnhancedDiffResult
}