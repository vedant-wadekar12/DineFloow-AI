import IORedis from "ioredis";
import { logger } from "../config";

const redisUrl =
  process.env.REDIS_URL ??
  "redis://127.0.0.1:6379";

export const redisConnection =
  new IORedis(redisUrl, {
    maxRetriesPerRequest: null,
    enableOfflineQueue: false,
    connectTimeout: 1000,
    lazyConnect: false,
    retryStrategy(times) {
      if (times > 1) return null;
      return 500;
    },
  });

redisConnection.on("error", (err) => {
  logger.warn(`[Redis] Connection issue: ${err.message}`);
});