import http from "http";

import app from "./app";

import { env } from "./config";

import { redisConnection } from "./queues/redis.connection";

import {
  connectDatabase,
  disconnectDatabase,
  registerDatabaseEvents,
} from "./database";

import { seedDatabase } from "./database/seeders";

import { initializeSocket } from "./socket";

const startServer = async (): Promise<void> => {
  registerDatabaseEvents();

  await connectDatabase();

  await seedDatabase();

  // Create HTTP server from Express app
  const httpServer = http.createServer(app);

  // Initialize Socket.IO
  initializeSocket(httpServer);

  // Start HTTP + Socket.IO server
  httpServer.listen(
    env.PORT,
    env.HOST,
    () => {
      console.log(
        "======================================"
      );

      console.log(
        "🚀 DineFlow AI Backend Started"
      );

      console.log(
        `Environment : ${env.NODE_ENV}`
      );

      console.log(
        `Server      : http://${env.HOST}:${env.PORT}`
      );

      console.log(
        "Socket.IO   : Enabled"
      );

      console.log(
        "======================================"
      );
    }
  );

    const shutdown = async (signal: string) => {
    console.log(`\n${signal} received. Shutting down...`);

    httpServer.close(async () => {
      try {
        await disconnectDatabase();

        await redisConnection.quit();

        console.log("Server shutdown completed.");

        process.exit(0);
      } catch (error) {
        console.error("Shutdown error:", error);

        process.exit(1);
      }
    });
  };

  process.on("SIGINT", () => {
    void shutdown("SIGINT");
  });

  process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
  });

  process.on(
    "SIGINT",
    () => shutdown("SIGINT")
  );

  process.on(
    "SIGTERM",
    () => shutdown("SIGTERM")
  );
};

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);
});

startServer().catch((error) => {
  console.error(
    "❌ Failed to start DineFlow AI Backend:",
    error
  );

  process.exit(1);
});