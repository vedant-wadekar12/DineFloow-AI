import mongoose from "mongoose";

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.connection.close();

  console.log("MongoDB Connection Closed");
};