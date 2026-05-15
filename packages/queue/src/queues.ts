import { Queue } from 'bullmq';
import RedisClient from './redis';
import { QueueConfig } from '@letscode-dev-friendly/shared';

class QueueManager {
    private static instance: QueueManager;
    private queues: Map<string, Queue>;

    private constructor() {
        this.queues = new Map();
    }

    public static getInstance(): QueueManager {
        if (!QueueManager.instance) {
            QueueManager.instance = new QueueManager();
        }
        return QueueManager.instance;
    }

    public getQueue(name: string = QueueConfig.defaultQueueName): Queue {
        if (!this.queues.has(name)) {
            const queue = new Queue(name, { connection: RedisClient.getInstance() });
            this.queues.set(name, queue);
        }
        return this.queues.get(name)!;
    }
}

export default QueueManager;