import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts"],
    exclude: ["dist/**", "node_modules/**"],
    env: {
      NODE_ENV: "test",
      PORT: "5000",
      HOST: "localhost",
      MONGODB_URI: "mongodb://127.0.0.1:27017/dineflow_test",
      JWT_ACCESS_SECRET: "test_access_secret_key_1234567890",
      JWT_REFRESH_SECRET: "test_refresh_secret_key_1234567890",
      JWT_ACCESS_EXPIRES_IN: "15m",
      JWT_REFRESH_EXPIRES_IN: "7d",
      JWT_ISSUER: "DineFlowAI",
      BCRYPT_SALT_ROUNDS: "10",
      EMAIL_USER: "test@example.com",
      EMAIL_PASS: "password123",
      CLIENT_URL: "http://localhost:5173",
      REDIS_URL: "redis://127.0.0.1:6379",
    },
  },
});
