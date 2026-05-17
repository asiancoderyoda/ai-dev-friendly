import { FileGeneratorAgent, FileOperation } from "@letscode-dev-friendly/agents";

class OperationGraphExecutor {
  private _generator: FileGeneratorAgent;

  constructor() {
    this._generator = new FileGeneratorAgent();
  }

  async execute(
    operations: FileOperation[],
    repoPath: string,
    ticket: string,
    context: any,
  ): Promise<void> {
    const completed = new Set<string>();
    const totalOperations = operations.length;

    while (completed.size < totalOperations) {
      let operationExecutedInThisPass = false;

      for (const operation of operations) {
        if (completed.has(operation.id)) {
          continue;
        }

        // Verify all prerequisites have successfully finished
        const ready = (operation?.dependsOn || []).every((depId: string) => completed.has(depId));

        if (!ready) {
          continue;
        }

        console.log(`[OperationGraphExecutor] Executing step: ${operation.id} (${operation.type}) -> ${operation.filePath}`);

        await this._generator.generateFile(
          operation,
          repoPath,
          ticket,
          context,
        );

        completed.add(operation.id);
        operationExecutedInThisPass = true;
      }

      // If a full pass occurs and no operations could run, the graph has an unresolvable cyclic loop
      if (!operationExecutedInThisPass && completed.size < totalOperations) {
        const pendingIds = operations.filter(o => !completed.has(o.id)).map(o => o.id);
        throw new Error(`[OperationGraphExecutor] Graph Execution Deadlock detected! Cyclical dependency or unresolvable ID blocks found for steps: [${pendingIds.join(", ")}]`);
      }
    }
    console.log("[OperationGraphExecutor] Complete operational graph executed successfully.");
  }
}

export default OperationGraphExecutor;