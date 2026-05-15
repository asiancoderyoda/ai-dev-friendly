import { EmbeddingService } from "@letscode-dev-friendly/embeddings";
import { qdrantClient } from "./qdrant.client";

class SemanticSearch {
  private _embeddingService: EmbeddingService;
  constructor(embeddingService: EmbeddingService = new EmbeddingService()) {
    this._embeddingService = embeddingService;
  }

  async search(query: string, topK: number = 10) {
    try {
      const queryEmbedding =
        await this._embeddingService.createEmbedding(query);
      const searchResults = await qdrantClient.search("code_vectors", {
        vector: queryEmbedding,
        limit: topK,
      });
      return searchResults;
    } catch (e) {
      console.error("Error performing semantic search:", e);
      throw e;
    }
  }
}

export default SemanticSearch;
