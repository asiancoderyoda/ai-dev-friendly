import "dotenv/config";

import { IndexingPipelineService } from "@letscode-dev-friendly/indexing";
import { getRepoBasePath, getRepoSlug } from "@letscode-dev-friendly/shared";
import path from "path";

export const runIndexingPipeline = async () => {
  try {
    console.log("Starting indexing pipeline...", getRepoBasePath());
    const repoBasePath = getRepoBasePath();
    const repoPath = path.join(repoBasePath, getRepoSlug());
    const indexingPipelineService = new IndexingPipelineService(repoPath);
    await indexingPipelineService.run(getRepoSlug());
  } catch (e) {
    console.error("Error in indexing pipeline:", e);
    throw e;
  }
};