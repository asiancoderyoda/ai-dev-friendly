import OpenAI from 'openai';
import { OpenAIConfig } from '@letscode-dev-friendly/shared';

class EmbeddingService {
    private openAIClient: OpenAI;

    constructor() {
        this.openAIClient = new OpenAI({
            apiKey: OpenAIConfig.apiKey,
            baseURL: OpenAIConfig.baseURL,
        });
    }

    async createEmbedding(input: string): Promise<number[]> {
        try {
            const response = await this.openAIClient.embeddings.create({
                model: OpenAIConfig.embeddingModel || 'text-embedding-3-small',
                input,
            });
            return response.data[0].embedding;
        } catch (e) {
            console.error('Error creating embedding:', e);
            throw e;
        }
    }
}

export default EmbeddingService;