import path from 'path';
import fs from 'fs';
import { config as loadEnv } from 'dotenv';
import { enqueueTask } from '@letscode-dev-friendly/queue';
import { getRepoSlug } from '@letscode-dev-friendly/shared';

const repoRoot = path.resolve(__dirname, '../..');

loadEnv({ path: path.join(repoRoot, '.env') });

const run = async () => {
  const ticket = fs.readFileSync(
    path.join(repoRoot, 'tickets', 'FEATURE-001.md'),
    'utf-8',
  );

  console.log('Enqueuing task for ticket FEATURE-001...', ticket);

  await enqueueTask(
    'FEATURE-001',
    ticket,
    getRepoSlug(),
    path.join(repoRoot, 'repositories', getRepoSlug()),
  );
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
