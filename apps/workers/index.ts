import { setupQdrant } from "@letscode-dev-friendly/vector";
import { cloneRepo } from "./clone";
import { runIndexingPipeline } from "./index-repo";

const start = async () => {
    try {
        console.log("Initiating Process...");
        await setupQdrant();
        console.log('Vector database setup completed.');
        await cloneRepo();
        console.log('Repository cloning completed.');
        await runIndexingPipeline();
        console.log('Indexing pipeline completed.');
    } catch (e) {
        console.error('Error during worker initialization:', e);
    }
}

start().catch((err) => {
    console.error('Unhandled error in worker:', err);
    process.exit(1);
});