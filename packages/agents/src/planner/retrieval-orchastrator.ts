import { RetrievalEngine } from "@letscode-dev-friendly/retrieval";

class RetrievalOrchastrator {
    private retrievalEngine: RetrievalEngine;

    constructor(retrievalEngine: RetrievalEngine = new RetrievalEngine()) {
        this.retrievalEngine = retrievalEngine;
    }

    async orchestrateRetrieval(query: string, symbols: any[]) {
        return await this.retrievalEngine.hybridRetrieve(query, symbols);
    }
}

export default RetrievalOrchastrator;