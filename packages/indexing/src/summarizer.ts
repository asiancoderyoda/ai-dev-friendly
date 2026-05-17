import { SummarizerAgent } from '@letscode-dev-friendly/agents/src/summarizer';
import fs from 'fs';
import path from 'path';

class FileSummarizer {
    private _summarizerAgent: SummarizerAgent;
    constructor() {
        this._summarizerAgent = new SummarizerAgent();
    }

    async summarizeFile(filePath: string): Promise<string> {
        const fileContent =  fs.readFileSync(filePath, 'utf-8');
        const summary = await this._summarizerAgent.summarize(fileContent, filePath);
        return `
            File: ${path.basename(filePath)}
            Summary: ${summary}
        `;
    }
}

export default FileSummarizer;