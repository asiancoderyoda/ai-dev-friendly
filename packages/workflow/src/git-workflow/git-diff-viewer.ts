import simpleGit from "simple-git";
import fs from "fs";
import { EnhancedDiffResult } from "../schema/workflow.types";

/**
 * Retrieves a complete git diff string including brand-new untracked source files.
 */
class GitDiffViewer {
    async getDiff(repoPath: string): Promise<EnhancedDiffResult> {
        const git = simpleGit(repoPath);

        try {
            // 1. Mark untracked files as intent-to-add (-N)
            // This forces Git to acknowledge new files inside 'git diff' outputs without staging them into a commit index yet.
            await git.add(["--intent-to-add", "."]);

            // 2. Extract raw cryptographic unified diff string
            const rawDiff = await git.diff();

            // 3. Extract lightweight statistics for pipeline logs/metrics
            const summary = await git.diffSummary();

            const result: EnhancedDiffResult = {
                rawDiff,
                hasChanges: rawDiff.trim().length > 0,
                stats: {
                    changedFilesCount: summary.files.length,
                    insertions: summary.insertions,
                    deletions: summary.deletions
                }
            };

            // If no changes exist, cleanly reverse the intent-to-add so we leave the working tree immaculate
            if (!result.hasChanges) {
                await git.reset(["."]);
            }

            return result;
        } catch (e) {
            console.error(`[GitDiffViewer] Critical error generating repository diff metrics:`, e);

            // Fail-safe cleanup: try to unstage intentional additions if a crash happens mid-execution
            try { await git.reset(["."]); } catch { }

            throw e;
        }
    }
}

export default GitDiffViewer;