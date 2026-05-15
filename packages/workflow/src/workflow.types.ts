interface WorkflowState {
    ticket: string;
    repoPath: string;
    targetFile: string;
    generatedPatch?: string;
    reviewSummary?: string;
    validationPassed?: boolean;
    branchName?: string;
}

export {
    WorkflowState
}