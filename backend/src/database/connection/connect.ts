import mongoose from "mongoose";
import { logger } from "../../config";

import { env } from "../../config";

import { configureMongoose } from "./mongoose.config";
import {
  MAX_RETRY_ATTEMPTS,
  RETRY_DELAY,
} from "./retry";

export const connectDatabase = async (): Promise<void> => {
  configureMongoose();

  let attempts = 0;

  while (attempts < MAX_RETRY_ATTEMPTS) {
    try {
      logger.info(
        `🔌 Connecting to MongoDB... Attempt ${attempts + 1}/${MAX_RETRY_ATTEMPTS}`
      );

      await mongoose.connect(env.MONGODB_URI, {
        family: 4,

        serverSelectionTimeoutMS: 10000,

        connectTimeoutMS: 10000,

        socketTimeoutMS: 45000,

        maxPoolSize: 10,

        minPoolSize: 2,

        retryWrites: true,

        retryReads: true,
      });

      logger.info("✅ MongoDB Connected");

      logger.info(
        `Database : ${mongoose.connection.name}`
      );

      logger.info(
        `Host : ${mongoose.connection.host}`
      );

      logger.info(
        `Ready State : ${mongoose.connection.readyState}`
      );

      return;
    } catch (error) {
      attempts++;

      logger.error(
        `❌ MongoDB Connection Failed (${attempts}/${MAX_RETRY_ATTEMPTS})`
      );

      logger.error(error);

      if (attempts >= MAX_RETRY_ATTEMPTS) {
        logger.error(
          "❌ MongoDB connection failed after maximum retry attempts."
        );

        throw error;
      }

      logger.warn(
        `⏳ Retrying MongoDB connection in ${RETRY_DELAY}ms...`
      );

      await new Promise((resolve) =>
        setTimeout(resolve, RETRY_DELAY)
      );
    }
  }
};