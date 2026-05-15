import { getRepoBasePath, getRepoRemoteURL, getRepoSlug } from "@letscode-dev-friendly/shared";
import { GitWorkflowService } from "@letscode-dev-friendly/workflow";

const gitWorkflowService = new GitWorkflowService();

const run = async () => {
  console.log("Starting repository cloning...", getRepoBasePath());
  await gitWorkflowService.cloneRepository(
    getRepoSlug(),
    getRepoRemoteURL(),
  );
};

run().catch((err) => {
  console.error("Error in cloning repository:", err);
  process.exit(1);
});