import mongoose from "mongoose";

import { env } from "../../config";

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGODB_URI);

    console.log("✅ MongoDB Connected");

    console.log(`Database : ${mongoose.connection.name}`);

    console.log(`Host     : ${mongoose.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Failed");

    console.error(error);

    process.exit(1);
  }
};