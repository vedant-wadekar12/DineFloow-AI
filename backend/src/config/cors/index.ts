import cors from "cors";
import { env } from "../environment";

const allowedOrigins = env.CLIENT_URL
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const corsConfig = cors({
  origin: (origin, callback) => {
    // Allow requests without an Origin header
    // such as Postman/server-to-server requests.
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("CORS origin not allowed."));
  },

  credentials: true,
});