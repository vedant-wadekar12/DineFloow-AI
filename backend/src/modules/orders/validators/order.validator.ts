import { z } from "zod";

export const createOrderSchema = z.object({
  cartId: z.string().min(1),

  restaurantId: z.string().min(1),

  branchId: z.string().optional(),

  customerId: z.string().optional(),

  tableId: z.string().optional(),

  orderType: z
    .enum([
      "DINE_IN",
      "TAKEAWAY",
      "DELIVERY",
    ])
    .default("DINE_IN"),

  customerNote: z
    .string()
    .max(1000)
    .optional(),
});

export const updateOrderStatusSchema =
  z.object({
    status: z.enum([
      "PENDING",
      "CONFIRMED",
      "PREPARING",
      "READY",
      "SERVED",
      "COMPLETED",
      "CANCELLED",
    ]),
  });

export const cancelOrderSchema =
  z.object({
    reason: z
      .string()
      .min(2)
      .max(500),
  });