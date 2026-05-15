import { FileGeneratorAgent } from "@letscode-dev-friendly/agents";

class OperationGraphExecutor {
  private _generator: FileGeneratorAgent;

  constructor() {
    this._generator = new FileGeneratorAgent();
  }

  async execute(
    operations: any[],
    repoPath: string,
    ticket: string,
    context: any,
  ) {
    const completed =
      new Set<string>();

    while (
      completed.size <
      operations.length
    ) {
      for (const operation of operations) {
        if (
          completed.has(
            operation.id,
          )
        ) {
          continue;
        }

        const ready =
          operation.dependsOn.every(
            (d: string) =>
              completed.has(d),
          );

        if (!ready) {
          continue;
        }

        console.log("OperationGraphExecutor: Executing operation - ", operation);

        await this._generator.generateFile(
          operation,
          repoPath,
          ticket,
          context,
        );

        completed.add(
          operation.id,
        );
      }
    }
  }
}

export default OperationGraphExecutor;