import mongoose from "mongoose";
import { logger } from "../../config";

import { env } from "../../config";

import { configureMongoose } from "./mongoose.config";
import { MAX_RETRY_ATTEMPTS, RETRY_DELAY } from "./retry";

export const connectDatabase = async () => {
  configureMongoose();

  let attempts = 0;

  while (attempts < MAX_RETRY_ATTEMPTS) {
    try {
      await mongoose.connect(env.MONGODB_URI);

      logger.info("✅ MongoDB Connected");

      logger.info(`Database : ${mongoose.connection.name}`);

      logger.info(`Host : ${mongoose.connection.host}`);

      return;
    } catch (error) {
      attempts++;

      logger.error(
        `MongoDB Connection Failed (${attempts}/${MAX_RETRY_ATTEMPTS})`
      );

      if (attempts >= MAX_RETRY_ATTEMPTS) {
        process.exit(1);
      }

      await new Promise((resolve) =>
        setTimeout(resolve, RETRY_DELAY)
      );
    }
  }
};