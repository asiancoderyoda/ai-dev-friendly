import { VectorIndexer } from "@letscode-dev-friendly/vector";
import RepositoryIndexer from "./indexer";
import FileSummarizer from "./summarizer";
import { DatabaseService, Symbol } from "@letscode-dev-friendly/database";
import { EmbeddingService } from "@letscode-dev-friendly/embeddings";


class IndexingPipelineService {
    private _repoPath: string;
    private _indexer: RepositoryIndexer;
    private _fileSummarizer: FileSummarizer;
    private _vectorIndexer: VectorIndexer;
    private _embeddingService: EmbeddingService;
    private _db: DatabaseService

    
    constructor(repoPath: string) {
        this._repoPath = repoPath;
        this._indexer = new RepositoryIndexer(repoPath);
        this._fileSummarizer = new FileSummarizer();
        this._vectorIndexer = new VectorIndexer();
        this._embeddingService = new EmbeddingService();
        this._db = new DatabaseService();
    }

    async run(repoName: string) {
        try {
            const db = await this._db.initialize();
            const SymbolEntityRepository = db.getRepository(Symbol);
            const symbols = await this._indexer.indexRepository();

            for (const symbol of symbols) {
                const summary = await this._fileSummarizer.summarizeFile(symbol.filePath);
                const embedding = await this._embeddingService.createEmbedding(summary);
                const vectorId = crypto.randomUUID();
                await this._vectorIndexer._saveToDatabase(vectorId, summary, embedding, {
                    name: symbol.name,
                    filePath: symbol.filePath,
                    imports: symbol.imports,
                    exports: symbol.exports,
                    repoName
                });
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
            }
        } catch (e) {
            console.error("Error occurred during indexing pipeline execution:", e);
            throw e;
        }
    }
}

export default IndexingPipelineService;