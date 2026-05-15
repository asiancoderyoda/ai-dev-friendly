import simpleGit from "simple-git";

class GitDiffService {
 async getChangedFiles(repoPath: string): Promise<string[]> {
    const git = simpleGit(repoPath);
    try {
      const diff = await git.diff(["--name-only", "HEAD~1", "HEAD"]);
      return diff.split('\n').filter((f): f is string => !!f);
    } catch (e) {
      console.error(`Error getting changed files:`, e);
      throw e;
    }
 }
}

export default GitDiffService;