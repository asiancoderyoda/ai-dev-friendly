import 'dotenv/config';

import { QueueManager } from './index';
import { QueueConfig } from '@letscode-dev-friendly/shared';

async function enqueueTask(ticketID: string, ticket: string, repoSlug: string, repoPath: string) {
    const queueManager = QueueManager.getInstance();
    const queue = queueManager.getQueue(QueueConfig.defaultQueueName);

    await queue.add(ticketID, {
        ticket: ticket,
        repoSlug: repoSlug,
        repoPath: repoPath
    }, {
        attempts: 3, // Retry up to 3 times if the job fails
        backoff: {
            type: 'exponential',
            delay: 5000, // Initial delay of 5 seconds before retrying
        },
        removeOnComplete: true, // Remove job from queue when completed
        removeOnFail: false, // Keep job in queue if it fails
    });

    console.log('Job added to the queue');
}

export {
    enqueueTask
}