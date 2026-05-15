import fs from 'fs';
import { llm } from '../shared/llm';
import { getCodingAgentPrompt } from './coding.prompt';


class CodingAgent {
    async generatePatch(taskDescription: string, filePath: string): Promise<string> {
        try {
            const codeContext = fs.readFileSync(filePath, 'utf8');
            const prompt = getCodingAgentPrompt(taskDescription,'','', codeContext);
            const response = await llm.invoke(prompt);
            return response.content as string;
        } catch (e) {
            console.error("Error occurred while executing planner agent:", e);
            throw e;
        }
    }
}

export default CodingAgent;