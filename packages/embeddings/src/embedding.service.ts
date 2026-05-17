import { Embeddings } from "@langchain/core/embeddings";
import { OllamaEmbeddings } from "@langchain/ollama";
import { OpenAIEmbeddings } from "@langchain/openai";
import { AIConfig, getLLMProvider } from "@letscode-dev-friendly/shared";

class EmbeddingService {
    private embeddingClient: Embeddings;

    constructor() {
        this.embeddingClient = getLLMProvider() === 'ollama'
            ? new OllamaEmbeddings({
                baseUrl: AIConfig.baseURL,
                model: AIConfig.embeddingModel || 'mxbai-embed-large',
            })
            : new OpenAIEmbeddings({
                apiKey: AIConfig.apiKey,
                modelName: AIConfig.embeddingModel || 'text-embedding-3-small',
            });
    }

    async createEmbedding(input: string): Promise<number[]> {
        try {
            const embedding = await this.embeddingClient.embedQuery(input);
            return embedding;
        } catch (e) {
            console.error('Error occurred while creating vector embedding:', e);
            throw e;
        }
    }
}

export default EmbeddingService;