import { llm } from "../shared/llm";
import { getDecomposerPrompt } from "./decomposer.prompt";
import { DecomposerResponse, DecomposerResponseSchema } from "./schema/decomposer.interface";

class DecomposerAgent {
  // Bind the structured output layer natively to intercept text anomalies
  private structuredLlm = llm.withStructuredOutput(DecomposerResponseSchema, {
    name: "decomposer_processor"
  });

  async decompose(ticket: string): Promise<DecomposerResponse> {
    try {
      console.log(`[DecomposerAgent] Breaking engineering ticket down into operational DAG steps...`);
      const prompt = getDecomposerPrompt(ticket);

      const response = await this.structuredLlm.invoke(prompt);

      // Self-correction layer: Filter out any self-referencing dependency accidents before returning
      response.operations = response.operations.map(op => ({
        ...op,
        dependsOn: op.dependsOn.filter(depId => depId !== op.id)
      }));

      return response;
    } catch (e) {
      console.error("Critical parsing fallback triggered. Error in DecomposerAgent:", e);
      throw e;
    }
  }
}

export default DecomposerAgent;