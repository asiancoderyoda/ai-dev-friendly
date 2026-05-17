import { z } from "zod";

export const ReviewerResponseSchema = z.object({
    summary: z.string().describe("A concise technical overview of the changes and overall quality."),
    riskAssessment: z.enum(["low", "medium", "high"]).describe("The potential stability impact level of this change on the target branch."),
    missingTestCases: z.array(z.string()).describe("Specific scenarios or coverage paths completely omitted from the diff validation."),
    actionableFeedback: z.array(z.string()).describe("A list of concrete, itemized code adjustments or refactoring demands."),
    approvalRecommendation: z.enum(["approve", "requires_changes", "reject"]).describe("The formal decision constraint for the pipeline gate.")
});

export type ReviewResult = z.infer<typeof ReviewerResponseSchema>;