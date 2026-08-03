import mongoose from "mongoose";

export const registerDatabaseEvents = (): void => {
  mongoose.connection.on("connected", () => {
    console.log("🟢 MongoDB Connected");
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("🟡 MongoDB Disconnected");
  });

  mongoose.connection.on("reconnected", () => {
    console.log("🔵 MongoDB Reconnected");
  });

  mongoose.connection.on("error", (error) => {
    console.error("🔴 MongoDB Error");
    console.error(error);
  });
};