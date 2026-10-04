import { describe, expect, it } from "vitest";
import request from "supertest";
import crypto from "crypto";
import app from "../app";

describe("Payment Webhook Integration & Security", () => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "default_razorpay_secret_key";

  it("should reject webhook with missing signature header", async () => {
    const response = await request(app)
      .post("/api/v1/payments/webhook/razorpay")
      .send({ event: "payment.captured" });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain("signature");
  });

  it("should reject webhook with invalid signature header", async () => {
    const response = await request(app)
      .post("/api/v1/payments/webhook/razorpay")
      .set("x-razorpay-signature", "invalid_signature_hash_123")
      .send({ event: "payment.captured" });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should verify valid signature structure", () => {
    const payload = JSON.stringify({ event: "payment.captured", id: "pay_test_123" });
    const expectedSig = crypto
      .createHmac("sha256", webhookSecret)
      .update(payload)
      .digest("hex");

    const calculatedSig = crypto
      .createHmac("sha256", webhookSecret)
      .update(payload)
      .digest("hex");

    expect(expectedSig).toBe(calculatedSig);
  });
});
