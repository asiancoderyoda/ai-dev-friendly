import "dotenv/config";

import { IndexingPipelineService } from "@letscode-dev-friendly/indexing";
import { getRepoBasePath, getRepoSlug } from "@letscode-dev-friendly/shared";
import path from "path";

const run = async () => {
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

run().catch((err) => {
  console.error("Error in indexing pipeline execution:", err);
  process.exit(1);
});