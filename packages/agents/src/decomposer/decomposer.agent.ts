import { llm } from "../shared/llm";
import { getDecomposerPrompt } from "./decomposer.prompt";

class DecomposerAgent {
  async decompose(ticket: string) {
    try {
      const prompt = getDecomposerPrompt(ticket);
      const response = await this._callLLM(prompt);
      return response;
    } catch (e) {
      console.error("Error in DecomposerAgent:", e);
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

export default DecomposerAgent;