import app from "./app";
import { env } from "./config";

const server = app.listen(env.PORT, () => {
  console.log("==================================");
  console.log("🚀 DineFlow AI Backend Started");
  console.log(`Environment : ${env.NODE_ENV}`);
  console.log(`Server      : http://${env.HOST}:${env.PORT}`);
  console.log("==================================");
});

const shutdown = (signal: string) => {
  console.log(`\n${signal} received. Shutting down...`);

  server.close(() => {
    console.log("HTTP Server Closed");
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));