import { VectorIndexer } from "@letscode-dev-friendly/vector";
import RepositoryIndexer from "./indexer";
import FileSummarizer from "./summarizer";
import { DatabaseService, Symbol as SymbolEntity } from "@letscode-dev-friendly/database";
import { EmbeddingService } from "@letscode-dev-friendly/embeddings";
import pLimit from 'p-limit'; // Run: npm install p-limit to handle clean async concurrency bounds

class IndexingPipelineService {
    private _repoPath: string;
    private _indexer: RepositoryIndexer;
    private _fileSummarizer: FileSummarizer;
    private _vectorIndexer: VectorIndexer;
    private _embeddingService: EmbeddingService;
    private _db: DatabaseService;
    private _concurrencyLimit = 10; // Maximizes system hardware/network API boundaries safely

    constructor(repoPath: string) {
        this._repoPath = repoPath;
        this._indexer = new RepositoryIndexer(repoPath);
        this._fileSummarizer = new FileSummarizer();
        this._vectorIndexer = new VectorIndexer();
        this._embeddingService = new EmbeddingService();
        this._db = new DatabaseService();
    }

    async run(repoName: string): Promise<void> {
        const db = await this._db.initialize();
        
        // Use TypeORM query runners for multi-row data-integrity transactions
        const queryRunner = db.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const SymbolEntityRepository = queryRunner.manager.getRepository(SymbolEntity);
            const symbols = await this._indexer.indexRepository();
            console.log(`Pipeline executing optimization sequence for ${symbols.length} symbols...`);

            // Deduplication Cache: Prevents processing the same file multiple times
            const summaryCache = new Map<string, string>();
            const embeddingCache = new Map<string, number[]>();

            // Thread-safe async rate balancer setup
            const limit = pLimit(this._concurrencyLimit);

            const executionWorkers = symbols.map((symbol) => {
                return limit(async () => {
                    // 1. Process or read cached file summary
                    let summary = summaryCache.get(symbol.filePath);
                    if (!summary) {
                        summary = await this._fileSummarizer.summarizeFile(symbol.filePath);
                        summaryCache.set(symbol.filePath, summary);
                    }

                    // 2. Process or read cached text vector embeddings
                    let embedding = embeddingCache.get(summary);
                    if (!embedding) {
                        embedding = await this._embeddingService.createEmbedding(summary);
                        embeddingCache.set(summary, embedding);
                    }

                    const vectorId = crypto.randomUUID();

                    // 3. Write data directly to downstream pipeline vectors
                    await this._vectorIndexer._saveToDatabase(vectorId, summary, embedding, {
                        name: symbol.name,
                        filePath: symbol.filePath,
                        imports: symbol.imports,
                        exports: symbol.exports,
                        repoName
                    });

                    // 4. Construct entity schemas cleanly inside database transaction memory
                    const symbolEntity = SymbolEntityRepository.create({
                        name: symbol.name,
                        type: symbol.type,
                        filePath: symbol.filePath,
                        summary,
                        imports: symbol.imports,
                        exports: symbol.exports,
                        vectorId,
                        repoName
                    });

                    await SymbolEntityRepository.save(symbolEntity);
                });
            });

            // Execute tasks in parallel up to the worker concurrency limit
            await Promise.all(executionWorkers);

            // Commit mutations seamlessly if every worker threads successfully
            await queryRunner.commitTransaction();
            console.log(`Pipeline successfully indexed and committed repository: "${repoName}"`);

        } catch (error) {
            console.error("Critical error in indexing pipeline execution. Rolling back database updates...", error);
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}

export default IndexingPipelineService;