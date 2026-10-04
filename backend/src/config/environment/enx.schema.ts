import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  PORT: z.coerce.number().positive().default(5000),

  HOST: z.string().min(1).default("0.0.0.0"),

  MONGODB_URI: z.string().min(1),

  JWT_ACCESS_SECRET: z.string().min(10),

  JWT_REFRESH_SECRET: z.string().min(10),

  JWT_ACCESS_EXPIRES_IN: z.string(),

  JWT_REFRESH_EXPIRES_IN: z.string(),

  JWT_ISSUER: z.string().min(1).default("dineflow-ai"),

  BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(8).max(15).default(10),

  EMAIL_USER: z.string().email().optional(),

  EMAIL_PASS: z.string().min(1).optional(),
CLIENT_URL: z
  .string()
  .min(1)
  .refine(
    (value) =>
      value
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean)
        .every((url) => {
          try {
            new URL(url);
            return true;
          } catch {
            return false;
          }
        }),
    {
      message: "CLIENT_URL must contain valid comma-separated URLs",
    }
  )
  .default("http://localhost:5173"),
  
});

export type Env = z.infer<typeof envSchema>;