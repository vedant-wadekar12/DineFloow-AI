import app from "./app";

import { env } from "./config";

import {
  connectDatabase,
  disconnectDatabase,
  registerDatabaseEvents,
} from "./database";

const startServer = async (): Promise<void> => {
  registerDatabaseEvents();

  await connectDatabase();

  const server = app.listen(
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
        "======================================"
      );
    }
  );

  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received`);

    server.close(async () => {
      await disconnectDatabase();

      console.log(
        "✅ Server shut down gracefully"
      );

      process.exit(0);
    });
  };

  process.on(
    "SIGINT",
    () => shutdown("SIGINT")
  );

  process.on(
    "SIGTERM",
    () => shutdown("SIGTERM")
  );
};

startServer().catch((error) => {
  console.error(
    "❌ Failed to start server:",
    error
  );

  process.exit(1);
});