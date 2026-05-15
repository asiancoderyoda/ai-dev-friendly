import { Project } from "ts-morph";

class ASTValidator {
    validateFile(filePath: string): boolean {
        const project = new Project();
        const sourceFile = project.addSourceFileAtPath(filePath);
        const diagnostics = sourceFile.getPreEmitDiagnostics();
        if (diagnostics.length > 0) {
            console.error(`Validation failed for ${filePath}:`);
            diagnostics.forEach(diagnostic => {
                const message = diagnostic.getMessageText();
                const lineNumber = diagnostic.getLineNumber();
                console.error(`Line ${lineNumber}: ${message}`);
            });
            return false;
        }
        return true;
    }
}

export default ASTValidator;