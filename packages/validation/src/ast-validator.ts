import { Project } from "ts-morph";
import path from "path";
import fs from "fs";

class ASTValidator {
    /**
     * Validates an isolated file's basic syntax structure cleanly inside its project boundaries.
     */
    validateFile(repoPath: string, relativeFilePath: string): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];
        try {
            const absolutePath = path.isAbsolute(relativeFilePath) 
                ? relativeFilePath 
                : path.join(repoPath, relativeFilePath);

            if (!fs.existsSync(absolutePath)) {
                return { isValid: false, errors: [`Target file path does not exist on disk: ${relativeFilePath}`] };
            }

            // Load tsconfig if it exists to resolve module maps safely without false flags
            const tsConfigPath = path.join(repoPath, "tsconfig.json");
            const project = new Project(
                fs.existsSync(tsConfigPath) ? { tsConfigFilePath: tsConfigPath } : {}
            );

            const sourceFile = project.addSourceFileAtPath(absolutePath);
            const diagnostics = sourceFile.getPreEmitDiagnostics();

            if (diagnostics.length > 0) {
                diagnostics.forEach(diagnostic => {
                    const message = typeof diagnostic.getMessageText() === "string" 
                        ? diagnostic.getMessageText() 
                        : JSON.stringify(diagnostic.getMessageText());
                    const lineNumber = diagnostic.getLineNumber();
                    errors.push(`Line ${lineNumber || "unknown"}: ${message}`);
                });
                return { isValid: false, errors };
            }

            return { isValid: true, errors: [] };
        } catch (e: any) {
            return { isValid: false, errors: [`AST Engine internal failure: ${e.message}`] };
        }
    }
}

export default ASTValidator;