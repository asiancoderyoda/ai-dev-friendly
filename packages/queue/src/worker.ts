import { Worker } from "bullmq";
import { RedisClient } from "./index";
import { WorkflowService } from "@letscode-dev-friendly/workflow";
import { QueueConfig } from "@letscode-dev-friendly/shared";

class QueueWorker {
    private _worker: Worker;

    constructor() {
        this._worker = new Worker(QueueConfig.defaultQueueName, this.processJob.bind(this), {
            connection: RedisClient.getInstance(),
        });

        this._worker.on("completed", (job) => {
            console.log(`Job with ID ${job?.id} has been completed.`);
        });

        this._worker.on("failed", (job, err) => {
            console.error(`Job with ID ${job?.id} has failed with error:`, err);
        });
    }

    private async processJob(job: any) {
        const { ticket, repoSlug, repoPath } = job.data;
        const workflowService = new WorkflowService(repoPath);
        await workflowService.executeWorkflow(ticket);
    }
}

export default QueueWorker;