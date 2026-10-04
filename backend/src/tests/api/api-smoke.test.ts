import {
  describe,
  expect,
  it,
} from "vitest";

import request from "supertest";

import app from "../../app";

const protectedGetRoutes = [
  "/api/v1/users",
  "/api/v1/customers",
  "/api/v1/suppliers",
  "/api/v1/purchases",
  "/api/v1/ai/recommendations",
  "/api/v1/orders",
  "/api/v1/billing",
  "/api/v1/payments",
  "/api/v1/coupons",
  "/api/v1/offers",
  "/api/v1/notifications",
  "/api/v1/analytics",
  "/api/v1/dashboard",
  "/api/v1/settings",
  "/api/v1/reports/sales",
  "/api/v1/audit",
  "/api/v1/loyalty",
  "/api/v1/subscriptions/plans",
  "/api/v1/inventory-items",
  "/api/v1/kitchen",
  "/api/v1/waiter",
  "/api/v1/stock",
  "/api/v1/menu-recipes",
  "/api/v1/menu-variants",
  "/api/v1/menu-addons",
  "/api/v1/menu-combos",
  "/api/v1/permissions",
  "/api/v1/restaurants",
  "/api/v1/branches",
  "/api/v1/floors",
  "/api/v1/qr",
  "/api/v1/tables",
  "/api/v1/employees",
  "/api/v1/categories",
  "/api/v1/menu-items",
];

describe("DineFlow AI - Automated API Smoke Tests", () => {
  describe("Public infrastructure APIs", () => {
    it("GET /api/v1/health should be reachable", async () => {
      const response = await request(app)
        .get("/api/v1/health");

      expect([200, 503]).toContain(response.status);

      expect(response.body)
        .toHaveProperty("success");
    });

    it("GET /api/v1/ready should return readiness information", async () => {
      const response = await request(app)
        .get("/api/v1/ready");

      expect([200, 503]).toContain(response.status);

      expect(response.body)
        .toHaveProperty("data");

      expect(response.body.data)
        .toHaveProperty("status");
    });
  });

  describe("Authentication APIs", () => {
    it("POST /api/v1/auth/login should validate credentials", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({});

      expect(response.status)
        .toBeGreaterThanOrEqual(400);

      expect(response.body)
        .toHaveProperty("success");
    });

    it("POST /api/v1/auth/register should validate registration data", async () => {
      const response = await request(app)
        .post("/api/v1/auth/register")
        .send({});

      expect(response.status)
        .toBeGreaterThanOrEqual(400);

      expect(response.body)
        .toHaveProperty("success");
    });

    it("POST /api/v1/auth/refresh should validate refresh token", async () => {
      const response = await request(app)
        .post("/api/v1/auth/refresh")
        .send({});

      expect(response.status)
        .toBeGreaterThanOrEqual(400);

      expect(response.body)
        .toHaveProperty("success");
    });

    it("POST /api/v1/auth/logout should validate refresh token", async () => {
      const response = await request(app)
        .post("/api/v1/auth/logout")
        .send({});

      expect(response.status)
        .toBeGreaterThanOrEqual(400);

      expect(response.body)
        .toHaveProperty("success");
    });
  });

  describe("Protected API authentication", () => {
    for (const route of protectedGetRoutes) {
      it(`GET ${route} should reject unauthenticated requests`, async () => {
        const response = await request(app)
          .get(route);

        expect(response.status).toBe(401);

        expect(response.body)
          .toHaveProperty("success");

        expect(response.body.success)
          .toBe(false);
      });
    }
  });

  describe("Webhook security", () => {
    it("should reject webhook without signature", async () => {
      const response = await request(app)
        .post("/api/v1/payments/webhook/razorpay")
        .send({
          event: "payment.captured",
        });

      expect(response.status).toBe(400);

      expect(response.body)
        .toHaveProperty("success");

      expect(response.body.success)
        .toBe(false);
    });

    it("should reject webhook with invalid signature", async () => {
      const response = await request(app)
        .post("/api/v1/payments/webhook/razorpay")
        .set(
          "x-razorpay-signature",
          "invalid-signature"
        )
        .send({
          event: "payment.captured",
        });

      expect(response.status).toBe(400);

      expect(response.body)
        .toHaveProperty("success");

      expect(response.body.success)
        .toBe(false);
    });
  });

  describe("Request ID", () => {
    it("should automatically generate X-Request-ID", async () => {
      const response = await request(app)
        .get("/api/v1/health");

      expect(response.headers)
        .toHaveProperty("x-request-id");

      expect(response.headers["x-request-id"])
        .toBeTruthy();
    });

    it("should preserve a client supplied X-Request-ID", async () => {
      const requestId =
        "automated-api-test-request-id";

      const response = await request(app)
        .get("/api/v1/health")
        .set("X-Request-ID", requestId);

      expect(response.headers["x-request-id"])
        .toBe(requestId);
    });
  });
});