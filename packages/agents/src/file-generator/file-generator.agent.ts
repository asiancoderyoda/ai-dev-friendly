import fs from "fs";
import path from "path";
import { z } from "zod";
import { llm } from "../shared/llm";
import { getFileGenerationPrompt } from "./file-generator.prompt";
import { FileOperation } from "../decomposer";

// Strict validation contract for what the generator LLM should output
const GeneratorResponseSchema = z.object({
  content: z.string().describe("The full production-ready implementation source code for the file. Do not use markdown blocks inside this code content.")
});

class FileGeneratorAgent {
  private structuredLlm = llm.withStructuredOutput(GeneratorResponseSchema, {
    name: "file_generator_processor"
  });

  async generateFile(operation: FileOperation, repoPath: string, taskDescription: string, context: any): Promise<string> {
    try {
      const fullPath = path.join(repoPath, operation.filePath);

      // Context Enrichment: If this is a modification, pull what is currently on disk 
      // so the LLM doesn't blindly destroy surrounding code.
      let currentFileContents = "";
      if ((operation.type === "modify_file" || operation.type === "rename_file") && fs.existsSync(fullPath)) {
        currentFileContents = fs.readFileSync(fullPath, "utf-8");
      }

      const prompt = getFileGenerationPrompt(taskDescription, operation, context, currentFileContents);

      console.log(`[FileGeneratorAgent] Querying generation model for code changes...`);
      const response = await this.structuredLlm.invoke(prompt);

      // Write updates to physical memory disk layers safely
      fs.mkdirSync(path.dirname(fullPath), { recursive: true });
      fs.writeFileSync(fullPath, response.content, "utf-8");

      return fullPath;
    } catch (e) {
      console.error(`Critical generation break inside file: ${operation.filePath}. Error:`, e);
      throw e;
    }
  }
}

export default FileGeneratorAgent;