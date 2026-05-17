export interface VerificationResult {
    success: boolean;
    stage: "AST" | "LINT" | "TYPECHECK";
    errorLogs: string[];
}