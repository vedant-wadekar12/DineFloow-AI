import { z } from "zod";

export const createOfferSchema =
  z.object({
    restaurantId: z.string().min(1),

    branchId: z.string().optional(),

    name: z.string().min(2).max(100),

    description: z.string().max(500).optional(),

    type: z.enum([
      "PERCENTAGE",
      "FIXED",
      "BUY_ONE_GET_ONE",
      "FREE_ITEM",
    ]),

    value: z.number().positive().optional(),

    minimumOrderAmount:
      z.number().min(0).default(0),

    maximumDiscountAmount:
      z.number().positive().optional(),

    buyQuantity:
      z.number().int().positive().optional(),

    getQuantity:
      z.number().int().positive().optional(),

    freeMenuItemId:
      z.string().optional(),

    applicableMenuItemIds:
      z.array(z.string()).default([]),

    applicableCategoryIds:
      z.array(z.string()).default([]),

    validFrom: z.coerce.date(),

    validUntil: z.coerce.date(),

    priority:
      z.number().int().min(0).default(0),
  });

export const updateOfferSchema =
  z.object({
    name: z.string().min(2).max(100).optional(),

    description:
      z.string().max(500).optional(),

    type: z.enum([
      "PERCENTAGE",
      "FIXED",
      "BUY_ONE_GET_ONE",
      "FREE_ITEM",
    ]).optional(),

    value:
      z.number().positive().optional(),

    minimumOrderAmount:
      z.number().min(0).optional(),

    maximumDiscountAmount:
      z.number().positive().optional(),

    buyQuantity:
      z.number().int().positive().optional(),

    getQuantity:
      z.number().int().positive().optional(),

    freeMenuItemId:
      z.string().optional(),

    applicableMenuItemIds:
      z.array(z.string()).optional(),

    applicableCategoryIds:
      z.array(z.string()).optional(),

    validFrom:
      z.coerce.date().optional(),

    validUntil:
      z.coerce.date().optional(),

    priority:
      z.number().int().min(0).optional(),
  });

export const offerStatusSchema =
  z.object({
    isActive: z.boolean(),
  });

export const calculateOfferSchema =
  z.object({
    offerId: z.string().min(1),

    orderAmount:
      z.number().positive(),
  });

export type CreateOfferInput =
  z.infer<typeof createOfferSchema>;

export type UpdateOfferInput =
  z.infer<typeof updateOfferSchema>;