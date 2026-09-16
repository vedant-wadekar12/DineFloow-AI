import { z } from "zod";

export const createLoyaltyAccountSchema =
  z.object({
    restaurantId: z.string().min(1),
    customerId: z.string().min(1),
  });

export const earnPointsSchema =
  z.object({
    restaurantId: z.string().min(1),
    customerId: z.string().min(1),

    points: z.number().int().positive(),

    orderId: z.string().optional(),

    reason: z.string().max(500).optional(),

    expiresAt: z.coerce.date().optional(),
  });

export const redeemPointsSchema =
  z.object({
    restaurantId: z.string().min(1),
    customerId: z.string().min(1),

    points: z.number().int().positive(),

    orderId: z.string().optional(),

    reason: z.string().max(500).optional(),
  });

export const adjustPointsSchema =
  z.object({
    restaurantId: z.string().min(1),
    customerId: z.string().min(1),

    points: z.number().int(),

    reason: z.string().min(2).max(500),
  });

export type EarnPointsInput =
  z.infer<typeof earnPointsSchema>;

export type RedeemPointsInput =
  z.infer<typeof redeemPointsSchema>;

export type AdjustPointsInput =
  z.infer<typeof adjustPointsSchema>;