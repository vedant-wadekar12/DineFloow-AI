import crypto from "crypto";
import { Types } from "mongoose";
import { WebhookEvent } from "../models/webhook-event.model";
import { Payment } from "../models/payment.model";
import { Bill } from "../../billing/models/bill.model";
import { Order } from "../../orders/models/order.model";
import { BadRequestError, NotFoundError } from "../../../common/errors";
import { logger } from "../../../config";

export class WebhookService {
  verifyRazorpaySignature(
    rawBody: Buffer | string,
    signature: string,
    secret: string
  ): boolean {
    if (!signature || !secret || !rawBody) {
      return false;
    }

    try {
      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(rawBody)
        .digest("hex");

      const sigBuffer = Buffer.from(signature);
      const expectedBuffer = Buffer.from(expectedSignature);

      if (sigBuffer.length !== expectedBuffer.length) {
        return false;
      }

      return crypto.timingSafeEqual(expectedBuffer, sigBuffer);
    } catch {
      return false;
    }
  }

  async processRazorpayWebhook(
    rawBody: Buffer | string,
    signature: string | undefined,
    payload: any,
    requestId?: string
  ) {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      if (process.env.NODE_ENV === "production") {
        logger.error(`[${requestId || "NO_REQ_ID"}] RAZORPAY_WEBHOOK_SECRET is not configured.`);
        throw new BadRequestError("Webhook service not configured.");
      }
      // Test/dev only: use a predictable test secret
      // In production this path is unreachable due to the check above
    }

    const resolvedSecret = webhookSecret ?? "default_razorpay_secret_key";

    if (!signature) {
      logger.warn(`[${requestId || "NO_REQ_ID"}] Webhook missing signature header.`);
      throw new BadRequestError("Webhook signature header is required.");
    }

    const isValid = this.verifyRazorpaySignature(
      rawBody,
      signature,
      resolvedSecret
    );

    if (!isValid) {
      logger.error(`[${requestId || "NO_REQ_ID"}] Webhook signature verification failed.`);
      throw new BadRequestError("Invalid webhook signature.");
    }

    const eventId =
      payload.event_id ||
      payload.id ||
      `evt_${payload.event}_${payload.payload?.payment?.entity?.id || Date.now()}`;

    // Persistent Database Idempotency Check
    const existingEvent = await WebhookEvent.findOne({ eventId });
    if (existingEvent) {
      logger.info(
        `[${requestId || "NO_REQ_ID"}] Duplicate webhook event skipped: ${eventId}`
      );
      return {
        processed: true,
        duplicate: true,
        eventId,
      };
    }

    const eventType = payload.event || "payment.captured";
    const paymentEntity = payload.payload?.payment?.entity || payload;
    const transactionId = paymentEntity.id || payload.payment_id;

    if (!transactionId) {
      throw new BadRequestError("Webhook payload missing payment transaction ID.");
    }

    // Lookup payment record in DB using transactionId or payment ID
    const payment = await Payment.findOne({
      $or: [{ transactionId }, { paymentNumber: transactionId }],
    });

    if (!payment) {
      logger.warn(
        `[${requestId || "NO_REQ_ID"}] Webhook payment record not found for transactionId: ${transactionId}`
      );
      throw new NotFoundError("Payment record not found for webhook transaction.");
    }

    // Derive tenant context strictly from existing DB record
    const restaurantId = payment.restaurantId;

    // Execute state transition
    if (eventType === "payment.captured" || eventType === "payment.authorized") {
      if (payment.status !== "SUCCESS") {
        payment.status = "SUCCESS";
        payment.paidAt = new Date();
        payment.gatewayResponse = paymentEntity;
        await payment.save();

        // Update Bill
        const bill = await Bill.findById(payment.billId);
        if (bill) {
          bill.paidAmount = bill.grandTotal;
          bill.dueAmount = 0;
          bill.status = "PAID";
          bill.paidAt = new Date();
          await bill.save();
        }

        // Update Order
        const order = await Order.findById(payment.orderId);
        if (order && order.status === "PENDING") {
          order.status = "CONFIRMED";
          order.confirmedAt = new Date();
          await order.save();
        }
      }
    } else if (eventType === "payment.failed") {
      if (payment.status === "PENDING" || payment.status === "PROCESSING") {
        payment.status = "FAILED";
        payment.failureReason =
          paymentEntity.error_description || "Payment failed via gateway webhook.";
        payment.gatewayResponse = paymentEntity;
        await payment.save();
      }
    }

    // Save Idempotent Webhook Log to Database
    await WebhookEvent.create({
      eventId,
      provider: "RAZORPAY",
      eventType,
      restaurantId,
      paymentId: payment._id,
      orderId: payment.orderId,
      status: "PROCESSED",
      payload: { event: eventType, transactionId },
      processedAt: new Date(),
    });

    logger.info(
      `[${requestId || "NO_REQ_ID"}] Webhook processed successfully for event ${eventId}, payment ${payment._id}`
    );

    return {
      processed: true,
      duplicate: false,
      eventId,
      paymentId: payment._id,
    };
  }
}

export const webhookService = new WebhookService();
