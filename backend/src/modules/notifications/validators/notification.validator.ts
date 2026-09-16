import { z } from "zod";

export const createNotificationSchema = z.object({
  restaurantId: z.string().optional(),
  branchId: z.string().optional(),

  recipientId: z.string().min(1),

  type: z.enum([
    "ORDER_CREATED",
    "ORDER_CONFIRMED",
    "ORDER_PREPARING",
    "ORDER_READY",
    "ORDER_SERVED",
    "ORDER_CANCELLED",
    "PAYMENT_SUCCESS",
    "PAYMENT_FAILED",
    "LOW_STOCK",
    "NEW_TASK",
    "TASK_COMPLETED",
    "LOYALTY",
    "SUBSCRIPTION",
    "SYSTEM",
  ]),

  channel: z
    .enum(["IN_APP", "EMAIL", "SMS", "PUSH"])
    .default("IN_APP"),

  title: z.string().min(1).max(200),

  message: z.string().min(1).max(2000),

  data: z.record(z.string(), z.unknown()).optional(),

  referenceType: z.string().optional(),

  referenceId: z.string().optional(),
});

export const notificationListSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  unreadOnly: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => value === "true"),
});