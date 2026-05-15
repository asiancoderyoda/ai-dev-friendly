import simpleGit from 'simple-git';
import { GitRemoteConfig } from "@letscode-dev-friendly/shared";

class GitWorkflowService {
    async createBranch(repoPath: string, message: string): Promise<boolean> {
        try {
            const git = simpleGit(repoPath);
            await git.addConfig('user.name', GitRemoteConfig.username);
            await git.addConfig('user.email', GitRemoteConfig.email);
            await git.add('.');
            await git.commit(message);
            return true;
        } catch (e) {
            throw new Error('Failed to create branch');
        }
    }

    async pushBranch(repoPath: string, branchName: string): Promise<boolean> {
        try {
            const git = simpleGit(repoPath);
            await git.push('origin', branchName);
            return true;
        } catch (e) {
            throw new Error('Failed to push branch');
        }
    }
}

export default GitWorkflowService;