import { z } from "zod";

export const createWaiterTaskSchema =
  z.object({
    orderId: z.string().min(1),
  });

export const assignWaiterSchema =
  z.object({
    waiterId: z.string().min(1),
  });

export const updateWaiterPrioritySchema =
  z.object({
    priority: z
      .number()
      .int()
      .min(0)
      .max(100),
  });

export const waiterCancelSchema =
  z.object({
    reason: z
      .string()
      .min(2)
      .max(500),
  });