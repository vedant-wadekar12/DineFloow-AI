import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../app";

describe("Multi-Tenant & Security Verification", () => {
  it("should reject unauthenticated request to protected tenant endpoint", async () => {
    const response = await request(app).get("/api/v1/branches");
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("should reject unauthenticated request to protected restaurants endpoint", async () => {
    const response = await request(app).get("/api/v1/restaurants");
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("should reject unauthenticated request to protected tables endpoint", async () => {
    const response = await request(app).get("/api/v1/tables");
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("should return valid X-Request-ID header on requests", async () => {
    const response = await request(app).get("/api/v1/health");
    expect(response.headers["x-request-id"]).toBeDefined();
  });

  it("should preserve client-supplied X-Request-ID header", async () => {
    const customId = "test-custom-request-id-12345";
    const response = await request(app)
      .get("/api/v1/health")
      .set("X-Request-ID", customId);
    expect(response.headers["x-request-id"]).toBe(customId);
  });
});
