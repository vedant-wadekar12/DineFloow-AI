import app from "./app";
import { logger } from "./config";
import { env } from "./config";
import { seedDatabase } from "./database/seeders";

import {
  connectDatabase,
  disconnectDatabase,
  registerDatabaseEvents,
} from "./database";


const startServer = async () => {
  registerDatabaseEvents();
  await connectDatabase();
  await seedDatabase();

  const server = app.listen(env.PORT, () => {
    logger.info("==================================");
    logger.info("🚀 DineFlow AI Backend Started");
    logger.info(`Environment : ${env.NODE_ENV}`);
    logger.info(`Server      : http://${env.HOST}:${env.PORT}`);
    logger.info("==================================");
  });

  const shutdown = async (signal: string) => {
    logger.info(`\n${signal} received`);

    server.close(async () => {
      await disconnectDatabase();

      process.exit(0);
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));

  process.on("SIGTERM", () => shutdown("SIGTERM"));
};

startServer();