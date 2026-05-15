import simpleGit, { SimpleGit } from 'simple-git';
import path from 'path';
import fs from 'fs';
import { getRepoBasePath, GitRemoteConfig } from "@letscode-dev-friendly/shared";

class GitWorkflowService {
    async cloneRepository(repoSlug: string, cloneUrl: string): Promise<void> {
        try {
            const repoBasePath = getRepoBasePath();
            const repoPath = path.join(repoBasePath, repoSlug);

            /**
             * Check if the repository already exists
             */
            if (fs.existsSync(repoPath)) {
                console.log(`Repository ${repoSlug} already exists at ${repoPath}`);
                return;
            }

            /**
             * Clone the repository using simple-git
             */
            const git = simpleGit();
            await git.clone(cloneUrl, repoPath);
            console.log(`Repository ${repoSlug} cloned successfully to ${repoPath}`);
        } catch (e) {
            console.error(`Error occurred while cloning repository ${repoSlug}:`, e);
        }
    }

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