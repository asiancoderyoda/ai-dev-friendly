import { FileGeneratorAgent } from "@letscode-dev-friendly/agents";

class MultiFileExecutor {
  private _fileGeneratorAgent: FileGeneratorAgent;
  constructor(
    fileGeneratorAgent: FileGeneratorAgent = new FileGeneratorAgent(),
  ) {
    this._fileGeneratorAgent = fileGeneratorAgent;
  }

    async execute(operations: any[], repoPath: string, taskDescription: string) {
        try {
            for (const operation of operations) {
                console.log("MultiFileExecutor: Executing operation - ", operation);
                await this._fileGeneratorAgent.generateFile(operation, repoPath, taskDescription);
            }
        } catch (e) {
                console.error("Error in MultiFileExecutor:", e);
                throw e;
        }
    }
}

export default MultiFileExecutor;