import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../app";

describe("Health & Readiness API", () => {
  it("should return health information", async () => {
    const response = await request(app).get("/api/v1/health");
    expect([200, 503]).toContain(response.status);
    expect(response.body).toHaveProperty("success");
  });

  it("should return readiness information", async () => {
    const response = await request(app).get("/api/v1/ready");
    expect([200, 503]).toContain(response.status);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("status");
  });
});