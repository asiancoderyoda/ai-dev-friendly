import { GeneratedPatch } from "./types";

class PatchParser {
    validatePatch(patch: GeneratedPatch): boolean {
        const { filePath, patch: patchContent, summary } = patch;
        if (!patchContent.includes('diff --git')) {
            throw new Error('Invalid patch format: Missing "diff --git" header');
        }
        return true;
    }
}

export default PatchParser;