import { z } from "zod";

export const createPaymentSchema =
  z.object({
    billId: z.string().min(1),

    amount: z.number().positive(),

    method: z.enum([
      "CASH",
      "UPI",
      "CARD",
      "NET_BANKING",
      "WALLET",
      "OTHER",
    ]),

    transactionId: z.string().optional(),

    gateway: z.string().optional(),

    currency: z.string().length(3).default("INR"),
  });

export const processPaymentSchema =
  z.object({
    transactionId: z.string().optional(),

    gatewayResponse:
      z.record(z.string(), z.unknown()).optional(),
  });

export const failPaymentSchema =
  z.object({
    reason: z.string().min(2).max(500),
  });

export const refundPaymentSchema =
  z.object({
    amount: z.number().positive(),

    reason: z.string().max(500).optional(),
  });

export type CreatePaymentInput =
  z.infer<typeof createPaymentSchema>;

export type ProcessPaymentInput =
  z.infer<typeof processPaymentSchema>;

export type FailPaymentInput =
  z.infer<typeof failPaymentSchema>;

export type RefundPaymentInput =
  z.infer<typeof refundPaymentSchema>;