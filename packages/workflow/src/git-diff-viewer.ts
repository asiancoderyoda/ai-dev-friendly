import simpleGit from "simple-git";

class GitDiffViewer {
    async getDiff(repoPath: string) {
        const git = simpleGit(repoPath);
        try {
            const diff = await git.diff();
            return diff;
        } catch (e) {
            console.error(`Error getting git diff:`, e);
            throw e;
        }
    }
}

export default GitDiffViewer;