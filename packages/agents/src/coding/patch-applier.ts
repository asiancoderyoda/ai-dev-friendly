import fs from 'fs';

import { applyPatch } from 'diff';

class PatchApplier {
    applyPatchToFile(filePath: string, patchContent: string): boolean {
        try {
            const originalContent = fs.readFileSync(filePath, 'utf8');
            const patchedContent = applyPatch(originalContent, patchContent);
            if (patchedContent === false) {
                throw new Error('Failed to apply patch: Patch could not be applied cleanly');
            }
            fs.writeFileSync(filePath, patchedContent, 'utf8');
            return true;
        } catch (e) {
            throw e;
        }
    }
}

export default PatchApplier;