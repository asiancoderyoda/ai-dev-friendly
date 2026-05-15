import { getPlannerPrompt } from "./planner.promt";
import { llm } from "../shared/llm";
import { PlannerStateType } from "../state/planner.state";

class PlannerAgent {
    constructor() {

    }

    async execute(state: PlannerStateType): Promise<PlannerStateType> {
        try {
            const prompt = getPlannerPrompt(state);
            const response = await this._callLLM(prompt);
            return {
                ...state,
                taskType: response.taskType,
                affectedAreas: response.affectedAreas,
                estimatedFiles: response.estimatedFiles,
                requiredTests: response.requiredTests,
                riskLevel: response.riskLevel,
                executionPlan: response?.executionPlan || [],
                retrievalResults: response?.retrievalResults || [],
            }
        } catch (e) {
            console.error("Error occurred while executing planner agent:", e);
            throw e;
        }
    }

    private async _callLLM(prompt: string) {
        try {
            const response = await llm.invoke(prompt);
            const parsedResponse = JSON.parse(response.content as string);
            return parsedResponse;
        } catch (e) {
            throw e;
        }
    }
}

export default PlannerAgent;