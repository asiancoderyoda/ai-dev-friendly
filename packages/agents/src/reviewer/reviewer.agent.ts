import { llm } from "../shared/llm";
import { getReviewerPrompt } from "./reviewer.prompt";

class ReviewerAgent {
    async review(diff: string) {
        try {
            const prompt = getReviewerPrompt(diff);
            const response = await llm.invoke(prompt);
            return response.content as string;
        } catch (e) {
            console.error("Error occurred while reviewing code:", e);
            throw e;
        }

    }
}

export default ReviewerAgent;