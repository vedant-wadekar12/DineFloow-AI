import { z } from "zod";

export const createCartSchema = z.object({
  restaurantId: z.string().min(1),

  branchId: z.string().optional(),

  customerId: z.string().optional(),

  tableId: z.string().optional(),

  sessionId: z.string().min(1),
});

export const addCartItemSchema = z.object({
  menuItemId: z.string().min(1),

  variantId: z.string().optional(),

  quantity: z.number().int().positive(),

  selectedAddons: z
    .array(
      z.object({
        addonId: z.string().min(1),
        quantity: z.number().int().positive(),
      })
    )
    .optional(),

  specialInstructions: z
    .string()
    .max(500)
    .optional(),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().positive(),

  specialInstructions: z
    .string()
    .max(500)
    .optional(),
});