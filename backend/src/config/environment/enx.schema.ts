import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),

  PORT: z.coerce.number().positive(),

  HOST: z.string().min(1),

  MONGODB_URI: z.string().min(1),

  JWT_ACCESS_SECRET: z.string().min(10),

  JWT_REFRESH_SECRET: z.string().min(10),

  JWT_ACCESS_EXPIRES_IN: z.string(),

  JWT_REFRESH_EXPIRES_IN: z.string(),

  JWT_ISSUER: z.string(),

  BCRYPT_SALT_ROUNDS: z.coerce.number(),

  EMAIL_USER: z.string().email(),

  EMAIL_PASS: z.string().min(1),

  CLIENT_URL: z.string().url(),
});

export type Env = z.infer<typeof envSchema>;