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

export {
  DatabaseConfig,
  RedisConfig,
  getRepoBasePath,
  BitbucketConfig,
};