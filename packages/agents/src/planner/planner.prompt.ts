import { PlannerStateType } from "./schema/planner.interface";

export const getPlannerPrompt = (state: PlannerStateType): string => {
    return `
        You are a Principal Software Architect analyzing an engineering ticket to generate an immutable, precise execution roadmap for downstream coding agents.

        CRITICAL ARCHITECTURAL RULES:
        1. Limit scope strictly to the direct requirements of the ticket. Do not propose speculative refactors or out-of-scope changes.
        2. Map your affected areas and estimated files using precise path structures or semantic names inferred from the ticket context.
        3. For fields requiring arrays, if no clear information exists, provide an empty array rather than hallucinating details.

        SCHEMA SPECIFICATION RULES FOR PROPERTIES:
        - taskType: Classify strictly into one of these buckets: "bug fix", "new feature", "refactor", "test coverage", "chore".
        - affectedAreas: Array of strings naming structural modules, boundaries, or application layers impacted.
        - estimatedFiles: Array of string file paths or module targets likely needing mutation.
        - requiredTests: Boolean value. Set to true if this implementation requires adding new tests or extending existing test suites (unit, integration, or e2e). Set to false only if no test generation is needed.
        - riskLevel: Classify strictly as "low", "medium", or "high".
        - executionPlan: Array of sequential, actionable, step-by-step instructions that a developer engine can execute linearly without ambiguity.

        JIRA TICKET SPECIFICATION:
        "${state.jiraTicket}"

        Generate the architectural assessment based on the ticket description above.
    `;
};