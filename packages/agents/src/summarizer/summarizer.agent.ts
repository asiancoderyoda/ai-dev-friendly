import { llm } from "../shared/llm";
import { getSummarizerPrompt } from "./summarizer.prompt";

class SummarizerAgent {
    async summarize(fileContent: string): Promise<string> {
        try {
            const prompt = getSummarizerPrompt(fileContent);
            const response = await llm.invoke(prompt);
            return response.content as string;
        } catch (e) {
            console.error("Error occurred while summarizing code:", e);
            throw e;
        }

    }
}

export default SummarizerAgent;