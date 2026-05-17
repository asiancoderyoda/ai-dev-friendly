import path from 'path';
import fs from 'fs';
import { config as loadEnv } from 'dotenv';
import { enqueueTask } from '@letscode-dev-friendly/queue';
import { getRepoBasePath, getRepoSlug } from '@letscode-dev-friendly/shared';
import { WorkflowService } from '@letscode-dev-friendly/workflow';

const repoRoot = path.resolve(__dirname, '../..');

loadEnv({ path: path.join(repoRoot, '.env') });

const run = async () => {
  const ticket = fs.readFileSync(
    path.join(repoRoot, 'tickets', 'FEATURE-001.md'),
    'utf-8',
  );

  console.log('Enqueuing task for ticket FEATURE-001...', ticket);

  const repoPath = path.join(getRepoBasePath(), getRepoSlug());
  const workflowService = new WorkflowService(repoPath);
  await workflowService.executeWorkflow(ticket);

};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
