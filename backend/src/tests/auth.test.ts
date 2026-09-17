import {
  describe,
  expect,
  it,
} from "vitest";

import request from "supertest";

import app from "../app";

describe("Authentication API", () => {
  it("should reject login with missing credentials", async () => {
    const response =
      await request(app)
        .post("/api/v1/auth/login")
        .send({});

    expect(response.status)
      .toBeGreaterThanOrEqual(400);

    expect(
      response.body
    ).toHaveProperty(
      "success"
    );
  });
});