import mongoose from "mongoose";

import {
  redisConnection,
} from "../queues/redis.connection";

export class HealthService {
  async getHealth() {
    const databaseConnected =
      mongoose.connection.readyState === 1;

    let redisConnected = false;

    try {
      const result =
        await redisConnection.ping();

      redisConnected =
        result === "PONG";
    } catch {
      redisConnected = false;
    }

    const memory =
      process.memoryUsage();

    return {
      status:
        databaseConnected &&
        redisConnected
          ? "healthy"
          : "degraded",

      timestamp:
        new Date().toISOString(),

      uptime:
        process.uptime(),

      environment:
        process.env.NODE_ENV ??
        "development",

      database: {
        connected:
          databaseConnected,

        state:
          mongoose.connection.readyState,

        name:
          mongoose.connection.name,

        host:
          mongoose.connection.host,
      },

      redis: {
        connected:
          redisConnected,
      },

      memory: {
        rss: memory.rss,
        heapTotal:
          memory.heapTotal,
        heapUsed:
          memory.heapUsed,
        external:
          memory.external,
      },
    };
  }
}