import { SummarizerAgent } from '@letscode-dev-friendly/agents/src/summarizer';
import fs from 'fs';
import path from 'path';

class FileSummarizer {
    private _summarizerAgent: SummarizerAgent;
    constructor() {
        this._summarizerAgent = new SummarizerAgent();
    }

    async summarizeFile(filePath: string): Promise<string> {
        /**
         * This is a placeholder implementation.
         * Later, LLM generated summarization to be implemented here, which would analyze the file content and generate a meaningful summary.
         * We will do a embedding after LLM generates the summary and store it in the database for future retrieval and reference.
         */
        const fileContent =  fs.readFileSync(filePath, 'utf-8');
        const summary = await this._summarizerAgent.summarize(fileContent);
        return `
            File: ${path.basename(filePath)}
            Summary: ${summary}
        `;
    }
}

export default FileSummarizer;