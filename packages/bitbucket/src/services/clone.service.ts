import simpleGit, { SimpleGit } from "simple-git";
import path from "path";
import fs from "fs";
import { getRepoBasePath } from "@letscode-dev-friendly/shared";

export class CloneService {
    private git: SimpleGit;
    constructor() {
        this.git = simpleGit();
    }

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
            await this.git.clone(cloneUrl, repoPath);
            console.log(`Repository ${repoSlug} cloned successfully to ${repoPath}`);
        } catch (e) {
            console.error(`Error occurred while cloning repository ${repoSlug}:`, e);
        }
    }
}