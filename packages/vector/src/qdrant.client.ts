import { QdrantClient } from '@qdrant/js-client-rest';
import { QdrantConfig } from '@letscode-dev-friendly/shared';

const qdrantClient = new QdrantClient({
    url: QdrantConfig.url,
    apiKey: QdrantConfig.apiKey,
});

export { qdrantClient };