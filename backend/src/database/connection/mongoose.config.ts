import mongoose from "mongoose";
import { env } from "../../config";

export const configureMongoose = (): void => {
  mongoose.set(
    "strictQuery",
    true
  );

  mongoose.set(
    "autoIndex",
    env.NODE_ENV === "development"
  );

  mongoose.set(
    "debug",
    env.NODE_ENV === "development"
  );
};