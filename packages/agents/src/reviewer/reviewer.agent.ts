import { llm } from "../shared/llm";
import { getReviewerPrompt } from "./reviewer.prompt";
import { ReviewerResponseSchema, ReviewResult } from "./schema/reviewer.interface";

class ReviewerAgent {
    // Force structured output mapping to stop markdown text spillover
    private structuredLlm = llm.withStructuredOutput(ReviewerResponseSchema, {
        name: "reviewer_processor"
    });

    async review(diff: string): Promise<ReviewResult> {
        try {
            // Guardrail: Fail fast if there are no changes to inspect
            if (!diff || diff.trim().length === 0) {
                return {
                    summary: "No differences detected in the working tree. The generated patch appears to be completely empty.",
                    riskAssessment: "low",
                    missingTestCases: [],
                    actionableFeedback: ["Verify downstream generation tools did not fail or skip writing updates."],
                    approvalRecommendation: "reject"
                };
            }

            console.log("[ReviewerAgent] Executing code review gate evaluation...");
            const prompt = getReviewerPrompt(diff);
            
            const response = await this.structuredLlm.invoke(prompt);
            return response;
        } catch (e) {
            console.error("Critical error encountered during automated code review processing:", e);
            throw e;
        }
    }
}

export default ReviewerAgent;