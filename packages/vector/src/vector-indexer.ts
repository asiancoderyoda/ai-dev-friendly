import { EmbeddingService } from "@letscode-dev-friendly/embeddings";
import { qdrantClient } from "./qdrant.client";

class VectorIndexer {
    private _embeddingService: EmbeddingService;
    constructor(embeddingService: EmbeddingService = new EmbeddingService()) {
        this._embeddingService = embeddingService;   
    }

    async indexSummary(id: string, summary: string, metadata: Record<string, any>) {
        try {
            const embedding = await this._embeddingService.createEmbedding(summary);
            await this._saveToDatabase(id, summary, embedding, metadata);
        } catch (e) {
            console.error('Error indexing summary:', e);
            throw e;
        }
    }

    async _saveToDatabase(id: string, summary: string, embedding: number[], metadata: Record<string, any>) {
        try {
            await qdrantClient.upsert('code_vectors', {
                wait: true,
                points: [
                {
                    id,
                    vector: embedding,
                    payload: {
                        summary,
                        ...metadata,
                    },
                }
            ]  
            });
        } catch (e) {
            throw e;
        }
    }
}

export default VectorIndexer;