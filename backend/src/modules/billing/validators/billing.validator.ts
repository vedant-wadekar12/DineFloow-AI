import { z } from "zod";

export const createBillSchema = z.object({
  orderId: z.string().min(1),

  discount: z.number().min(0).default(0),

  tax: z.number().min(0).default(0),

  serviceCharge: z.number().min(0).default(0),

  notes: z.string().max(500).optional(),
});

export const updateBillSchema = z.object({
  discount: z.number().min(0).optional(),

  tax: z.number().min(0).optional(),

  serviceCharge: z.number().min(0).optional(),

  notes: z.string().max(500).optional(),
});

export const cancelBillSchema = z.object({
  reason: z.string().min(2).max(500),
});

export type CreateBillInput = z.infer<typeof createBillSchema>;
export type UpdateBillInput = z.infer<typeof updateBillSchema>;
export type CancelBillInput = z.infer<typeof cancelBillSchema>;