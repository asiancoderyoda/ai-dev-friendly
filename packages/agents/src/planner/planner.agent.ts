import { getPlannerPrompt } from "./planner.prompt";
import { llm } from "../shared/llm";
import { PlannerStateType, PlannerResponseSchema } from "./schema/planner.interface";

class PlannerAgent {
    private structuredLlm = llm.withStructuredOutput(PlannerResponseSchema, {
        name: "planner_processor"
    });

    constructor() {}

    async execute(state: PlannerStateType): Promise<PlannerStateType> {
        try {
            console.log(`[PlannerAgent] Processing planning phase...`);
            const prompt = getPlannerPrompt(state);
            
            const response = await this.structuredLlm.invoke(prompt);

            return {
                ...state,
                ...response
            };
        } catch (e) {
            console.error("Error executing planner agent:", e);
            throw e;
        }
    }
}

export default PlannerAgent;