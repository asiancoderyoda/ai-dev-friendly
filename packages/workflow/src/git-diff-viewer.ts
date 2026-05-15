import simpleGit from "simple-git";

class GitDiffViewer {
    async showDiff(repoPath: string) {
        const git = simpleGit(repoPath);
        try {
            const diff = await git.diff();
            console.log(diff);
        } catch (e) {
            console.error(`Error showing git diff:`, e);
            throw e;
        }
    }
}

export default GitDiffViewer;