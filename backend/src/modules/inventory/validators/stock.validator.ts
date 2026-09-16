import { z } from "zod";

export const stockAdjustmentSchema =
  z.object({
    inventoryItemId: z.string().min(1),

    quantity: z.number().positive(),

    type: z.enum([
      "PURCHASE",
      "CONSUMPTION",
      "ADJUSTMENT",
      "WASTE",
      "RETURN",
    ]),

    reason: z
      .string()
      .max(500)
      .trim()
      .optional(),

    referenceType: z
      .string()
      .max(100)
      .trim()
      .optional(),

    referenceId: z
      .string()
      .min(1)
      .optional(),
  });