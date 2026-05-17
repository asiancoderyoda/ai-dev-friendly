import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import ASTValidator from "./ast-validator";
import { VerificationResult } from "./schema/validation.interface";

class ValidationService {
    private _astValidator: ASTValidator;

    constructor() {
        this._astValidator = new ASTValidator();
    }

    /**
     * Fast-pass local AST validation loop targeting specified modified paths.
     */
    runLocalASTCheck(repoPath: string, relativeFilePaths: string[]): VerificationResult {
        const aggregatedErrors: string[] = [];

        for (const filePath of relativeFilePaths) {
            const check = this._astValidator.validateFile(repoPath, filePath);
            if (!check.isValid) {
                aggregatedErrors.push(`[File: ${filePath}]\n${check.errors.join("\n")}`);
            }
        }

        return {
            success: aggregatedErrors.length === 0,
            stage: "AST",
            errorLogs: aggregatedErrors
        };
    }

    /**
     * Executes project-wide compliance scripts, catching text logs if execution fails.
     */
    runProjectVerification(repoPath: string): VerificationResult {
        const packageJsonPath = path.join(repoPath, "package.json");
        let hasLintScript = false;
        let hasTypecheckScript = false;

        // Verify script availability to prevent crashing on missing package definitions
        if (fs.existsSync(packageJsonPath)) {
            const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
            hasLintScript = !!pkg.scripts?.lint;
            hasTypecheckScript = !!pkg.scripts?.typecheck;
        }

        // 1. Run Linter Step
        if (hasLintScript) {
            try {
                console.log("[ValidationService] Running project linter...");
                execSync("npm run lint", { cwd: repoPath, stdio: "pipe", encoding: "utf-8" });
            } catch (e: any) {
                return {
                    success: false,
                    stage: "LINT",
                    errorLogs: [e.stdout || e.message || "Lint execution mismatch error."]
                };
            }
        }

        // 2. Run Compiler Typecheck Step
        if (hasTypecheckScript) {
            try {
                console.log("[ValidationService] Running project compiler typecheck...");
                execSync("npm run typecheck", { cwd: repoPath, stdio: "pipe", encoding: "utf-8" });
            } catch (e: any) {
                return {
                    success: false,
                    stage: "TYPECHECK",
                    errorLogs: [e.stdout || e.message || "Typecheck execution mismatch error."]
                };
            }
        } else if (fs.existsSync(path.join(repoPath, "node_modules", "typescript"))) {
            // Fallback: If no script exists but TypeScript is installed locally, run naked tsc compiler
            try {
                console.log("[ValidationService] No explicit typecheck script found. Falling back to raw local tsc check...");
                execSync("npx tsc --noEmit", { cwd: repoPath, stdio: "pipe", encoding: "utf-8" });
            } catch (e: any) {
                return {
                    success: false,
                    stage: "TYPECHECK",
                    errorLogs: [e.stdout || e.message]
                };
            }
        }

        return {
            success: true,
            stage: "TYPECHECK", // Terminal stage completed successfully
            errorLogs: []
        };
    }
}

export default ValidationService;