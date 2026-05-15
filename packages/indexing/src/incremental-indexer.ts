import { GitDiffService, RepositoryIndexer } from "./index";

class IncrementalIndexer {
    private _diffService: GitDiffService;
    private _repoIndexer: RepositoryIndexer;

    constructor(repoPath: string) {
        this._diffService = new GitDiffService();
        this._repoIndexer = new RepositoryIndexer(repoPath);
    }

    async reIndexChangedFiles(repoPath: string): Promise<void> {
        try {
            const changedFiles = await this._diffService.getChangedFiles(repoPath);
            if (changedFiles.length === 0) {
                console.log('No changed files detected. Skipping indexing.');
                return;
            }
            console.log(`Changed files detected: ${changedFiles.join(', ')}. Re-indexing...`);
            await this._repoIndexer.indexRepository();
            console.log('Re-indexing completed successfully.');
        } catch (e) {
            console.error('Error occurred while re-indexing changed files:', e);
            throw e;
        }
    }
}

export default IncrementalIndexer;