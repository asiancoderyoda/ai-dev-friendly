import { qdrantClient } from './qdrant.client';
import { getLLMProvider, AIConfig } from '@letscode-dev-friendly/shared';

const setupQdrant = async () => {
    try {
        const provider = getLLMProvider();

        let vectorSize = 1536;

        if (provider === 'ollama') {
            const model = AIConfig.embeddingModel || 'mxbai-embed-large';
            if (model === 'mxbai-embed-large') {
                vectorSize = 1024;
            } else if (model === 'nomic-embed-text') {
                vectorSize = 768;
            }
        }

        const collectionName = 'code_vectors';
        const collections = await qdrantClient.getCollections();
        const collectionExists = collections.collections.some((c) => c.name === collectionName);

        if (collectionExists) {
            console.log(`Checking existing configuration parameters for collection: "${collectionName}"...`);
            const info = await qdrantClient.getCollection(collectionName);
            const existingSize = info.config?.params?.vectors?.size;

            if (existingSize !== vectorSize) {
                console.warn(`Dimension mismatch encountered (DB: ${existingSize} vs Config: ${vectorSize}). Recreating collection...`);
                await qdrantClient.deleteCollection(collectionName);
                console.log(`Stale collection "${collectionName}" purged successfully.`);
            } else {
                console.log(`Collection "${collectionName}" matches required vector bounds (${vectorSize}). Setup skipped.`);
                return;
            }
        }

        console.log(`Creating collection "${collectionName}" with vector space layout size: ${vectorSize}...`);
        await qdrantClient.createCollection(collectionName, {
            vectors: {
                size: vectorSize,
                distance: 'Cosine',
            },
        });
        console.log(`Qdrant collection "${collectionName}" is set up successfully.`);

    } catch (e) {
        console.error('Error occurred while configuring Qdrant storage schemas:', e);
        throw e;
    }
}

export {
    setupQdrant,
}