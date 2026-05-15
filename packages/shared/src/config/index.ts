import path from "path";
import { config as loadEnv } from "dotenv";

loadEnv();

const required = (name: string): string => {
  const value = process.env[name];
  if (value === undefined || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const DatabaseConfig = {
  get url(): string {
    return required('DATABASE_URL');
  },
};

const RedisConfig = {
  get host(): string {
    return process.env.REDIS_HOST?.trim() || '127.0.0.1';
  },
  get port(): number {
    const raw = process.env.REDIS_PORT?.trim();
    const n = raw ? parseInt(raw, 10) : 6379;
    return Number.isFinite(n) ? n : 6379;
  },
  get password(): string {
    return process.env.REDIS_PASSWORD?.trim() || '';
  }
};


const getRepoBasePath = (): string => {
  const raw = process.env.REPO_BASE_PATH?.trim();
  const base = raw && raw.length > 0 ? raw : "repos";
  return path.isAbsolute(base) ? base : path.resolve(process.cwd(), base);
}

const BitbucketConfig = {
  get username(): string {
    return process.env.BITBUCKET_USERNAME?.trim() ?? "";
  },
  get appPassword(): string {
    return process.env.BITBUCKET_APP_PASSWORD?.trim() ?? "";
  },
  get workspace(): string {
    return process.env.BITBUCKET_WORKSPACE?.trim() ?? "";
  },
};

const OpenAIConfig = {
  get apiKey(): string {
    return required('OPENAI_API_KEY');
  },
  get baseURL(): string {
    return required('OPENAI_BASE_URL');
  },
  get embeddingModel(): string {
    return process.env.OPENAI_EMBEDDING_MODEL?.trim() || 'text-embedding-3-small';
  },
  get chatModel(): string {
    return process.env.OPENAI_CHAT_MODEL?.trim() || 'gpt-40-mini';
  }
}

const QdrantConfig = {
  get url(): string {
    return required('QDRANT_URL');
  },
  get apiKey(): string {
    return required('QDRANT_API_KEY');
  },
}

const GitRemoteConfig = {
  get remote_base_url(): string {
    return required('GIT_REMOTE_BASE_URL');
  },
  get username(): string {
    return required('GIT_REMOTE_USERNAME');
  },
  get email(): string {
    return required('GIT_REMOTE_EMAIL');
  },
  get password(): string {
    return required('GIT_REMOTE_PASSWORD');
  }
}

const QueueConfig = {
  get defaultQueueName(): string {
    return process.env.DEFAULT_QUEUE_NAME?.trim() || "workflow-queue";
  }
}

export {
  DatabaseConfig,
  RedisConfig,
  getRepoBasePath,
  BitbucketConfig,
  OpenAIConfig,
  QdrantConfig,
  GitRemoteConfig,
  QueueConfig
};