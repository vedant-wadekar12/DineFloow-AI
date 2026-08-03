import mongoose from "mongoose";
import { logger } from "../../config";

export const registerDatabaseEvents = (): void => {
  mongoose.connection.on("connected", () => {
    logger.info("MongoDB Connected");
  });

  mongoose.connection.on("disconnected", () => {
    logger.warn("MongoDB Disconnected");
  });

  mongoose.connection.on("reconnected", () => {
    logger.info("MongoDB Reconnected");
  });

  mongoose.connection.on("error", (error) => {
    logger.error(error);
  });
};