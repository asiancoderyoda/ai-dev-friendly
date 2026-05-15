import path from 'path';
import fs from 'fs';
import { config as loadEnv } from 'dotenv';
import { enqueueTask } from '@letscode-dev-friendly/queue';

const repoRoot = path.resolve(__dirname, '../..');

loadEnv({ path: path.join(repoRoot, '.env') });

const run = async () => {
  const ticket = fs.readFileSync(
    path.join(repoRoot, 'tickets', 'FEATURE-001.md'),
    'utf-8',
  );

  await enqueueTask(
    'FEATURE-001',
    ticket,
    'repo-slug',
    path.join(repoRoot, 'repositories', 'repo-slug'),
  );
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
