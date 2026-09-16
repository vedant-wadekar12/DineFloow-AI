import { z } from "zod";

export const createKitchenTicketSchema =
  z.object({
    orderId: z.string().min(1),
  });

export const updateKitchenStatusSchema =
  z.object({
    status: z.enum([
      "QUEUED",
      "ACCEPTED",
      "PREPARING",
      "READY",
      "CANCELLED",
    ]),
  });

export const assignChefSchema =
  z.object({
    chefId: z.string().min(1),
  });

export const cancelKitchenTicketSchema =
  z.object({
    reason: z
      .string()
      .min(2)
      .max(500),
  });

export const updatePrioritySchema =
  z.object({
    priority: z
      .number()
      .int()
      .min(0)
      .max(100),
  });