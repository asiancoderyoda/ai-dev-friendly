import { getRepoBasePath, getRepoRemoteURL, getRepoSlug } from "@letscode-dev-friendly/shared";
import { GitWorkflowService } from "@letscode-dev-friendly/workflow";

const gitWorkflowService = new GitWorkflowService();

export const cloneRepo = async () => {
  console.log("Starting repository cloning...", getRepoBasePath());
  await gitWorkflowService.cloneRepository(
    getRepoSlug(),
    getRepoRemoteURL(),
  );
};
