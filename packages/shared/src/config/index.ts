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

const getRepoRemoteURL = (): string => {
  return required('REPOSITORY_URL');
}

const getRepoSlug = (): string => {
  return required('REPOSITORY_SLUG');
}

const getLLMProvider = (): string => {
  return process.env.LLM_PROVIDER?.trim().toLowerCase() || 'openai';
}

const AIConfig = {
  get apiKey(): string {
    if (getLLMProvider() === 'ollama') {
      return ""
    }
    return required('OPENAI_API_KEY');
  },
  get baseURL(): string {
    if (getLLMProvider() === 'ollama') {
      return required('OLLAMA_BASE_URL');
    }
    return required('OPENAI_BASE_URL');
  },
  get embeddingModel(): string {
    if (getLLMProvider() === 'ollama') {
      return required('OLLAMA_EMBEDDING_MODEL');
    }
    return process.env.OPENAI_EMBEDDING_MODEL?.trim() || 'text-embedding-3-small';
  },
  get chatModel(): string {
    if (getLLMProvider() === 'ollama') {
      return required('OLLAMA_CHAT_MODEL');
    }
    return process.env.OPENAI_CHAT_MODEL?.trim() || 'gpt-4o-mini';
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

const getBranchName = (): string => {
  return process.env.BRANCH_NAME?.trim() || `patch-${Date.now()}`;
}

const getCommitMessage = (): string => {
  return process.env.COMMIT_MESSAGE?.trim() || `Automated patch commit at ${new Date().toISOString()}`;
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
  getRepoRemoteURL,
  getRepoSlug,
  AIConfig,
  QdrantConfig,
  GitRemoteConfig,
  QueueConfig,
  getLLMProvider,
  getBranchName,
  getCommitMessage
};