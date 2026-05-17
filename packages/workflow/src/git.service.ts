import simpleGit from 'simple-git';
import path from 'path';
import fs from 'fs';
import { getRepoBasePath, GitRemoteConfig } from "@letscode-dev-friendly/shared";

class GitWorkflowService {
    async cloneRepository(repoSlug: string, cloneUrl: string): Promise<string> {
        try {
            const repoBasePath = getRepoBasePath();
            const repoPath = path.join(repoBasePath, repoSlug);

            if (fs.existsSync(repoPath)) {
                console.log(`[Git] Repository ${repoSlug} already exists at ${repoPath}`);
                return repoPath;
            }

            const git = simpleGit();
            await git.clone(cloneUrl, repoPath);
            console.log(`[Git] Repository ${repoSlug} cloned successfully to ${repoPath}`);
            return repoPath;
        } catch (e) {
            console.error(`[Git] Critical failure cloning repository ${repoSlug}:`, e);
            throw e;
        }
    }

    async createBranchAndCommit(repoPath: string, branchName: string, commitMessage: string): Promise<boolean> {
        try {
            const git = simpleGit(repoPath);

            await git.addConfig('user.name', GitRemoteConfig.username);
            await git.addConfig('user.email', GitRemoteConfig.email);

            console.log(`[Git] Creating and switching to new branch: ${branchName}`);
            await git.checkoutLocalBranch(branchName);

            await git.add('.');
            await git.commit(commitMessage);

            return true;
        } catch (e) {
            console.error(`[Git] Failed to create branch and commit code updates:`, e);
            throw new Error('Failed to execute git local branching tracking operations');
        }
    }

    async pushBranch(repoPath: string, branchName: string): Promise<boolean> {
        try {
            const git = simpleGit(repoPath);
            console.log(`[Git] Pushing branch ${branchName} to origin upstream infrastructure...`);

            await git.push(['-u', 'origin', branchName]);
            return true;
        } catch (e) {
            console.error(`[Git] Upstream synchronization failure on branch [${branchName}]:`, e);
            throw new Error(`Failed to push tracking branch to remote git hosts`);
        }
    }
}

export default GitWorkflowService;