import { qdrantClient } from './qdrant.client';

const setupQdrant = async () => {
    try {
        const collections = await qdrantClient.getCollections();

        if (!collections.collections.some((c) => c.name === 'code_vectors')) {
            await qdrantClient.createCollection('code_vectors', {
                vectors: {
                    size: 1536,
                    distance: 'Cosine',
                },
            });
            console.log('Qdrant collection "code_vectors" is set up successfully.');
        }
    } catch (e) {
        console.error('Error setting up Qdrant:', e);
    }
}

export {
    setupQdrant,
}