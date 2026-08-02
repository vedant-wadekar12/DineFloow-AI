import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),

  PORT: z.coerce.number().positive(),

  HOST: z.string().min(1),
});

export type Env = z.infer<typeof envSchema>;