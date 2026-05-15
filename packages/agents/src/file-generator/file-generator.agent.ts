import fs from "fs";
import path from "path";
import { llm } from "../shared/llm";
import { getFileGenerationPrompt } from "./file-generator.prompt";

class FileGeneratorAgent {
  async generateFile(operation: any, repoPath: string, taskDescription: string) {
    try {
      const prompt = getFileGenerationPrompt(taskDescription, operation);
      const response = await this._callLLM(prompt);
      console.log("FileGeneratorAgent:", response);
      const fullPath = `${repoPath}/${response.filePath}`;
      fs.mkdirSync(path.dirname(fullPath), { recursive: true });
      fs.writeFileSync(fullPath, response.content as string, "utf-8");
      return fullPath;
    } catch (e) {
      console.error("Error in FileGeneratorAgent:", e);
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

export default FileGeneratorAgent;