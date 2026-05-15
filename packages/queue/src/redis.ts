import IORedis from "ioredis";
import { RedisConfig } from "@letscode-dev-friendly/shared";

class RedisClient {
    private static instance: IORedis;

    private constructor() {}

    public static getInstance(): IORedis {
        if (!RedisClient.instance) {
            RedisClient.instance = new IORedis({
                host: RedisConfig.host,
                port: RedisConfig.port,
                password: RedisConfig.password,
            });
        }
        return RedisClient.instance;
    }
}

export default RedisClient;