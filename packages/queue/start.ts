import fs from "fs";
import { enqueueTask } from "./src/enqueue";

const run = async () => {
    const ticket =
    fs.readFileSync(
      './tickets/FEATURE-001.md',
      'utf-8',
    );

    await enqueueTask(
        'FEATURE-001',
        ticket,
        'repo-slug',
        './repositories/repo-slug'
    );
}

run();