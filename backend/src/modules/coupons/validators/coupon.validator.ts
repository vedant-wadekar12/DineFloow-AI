import { z } from "zod";

export const createCouponSchema =
  z.object({
    restaurantId: z.string().min(1),

    branchId: z.string().optional(),

    code: z
      .string()
      .min(2)
      .max(30)
      .regex(
        /^[A-Za-z0-9_-]+$/,
        "Coupon code can contain only letters, numbers, hyphens and underscores."
      ),

    name: z.string().min(2).max(100),

    description: z.string().max(500).optional(),

    discountType: z.enum([
      "PERCENTAGE",
      "FIXED",
    ]),

    discountValue: z.number().positive(),

    minimumOrderAmount:
      z.number().min(0).default(0),

    maximumDiscountAmount:
      z.number().positive().optional(),

    usageLimit:
      z.number().int().positive().optional(),

    perCustomerLimit:
      z.number().int().positive().optional(),

    validFrom: z.coerce.date(),

    validUntil: z.coerce.date(),

    applicableMenuItemIds:
      z.array(z.string()).default([]),

    applicableCategoryIds:
      z.array(z.string()).default([]),
  });

export const updateCouponSchema =
  z.object({
    name: z.string().min(2).max(100).optional(),

    description: z.string().max(500).optional(),

    discountType: z.enum([
      "PERCENTAGE",
      "FIXED",
    ]).optional(),

    discountValue:
      z.number().positive().optional(),

    minimumOrderAmount:
      z.number().min(0).optional(),

    maximumDiscountAmount:
      z.number().positive().optional(),

    usageLimit:
      z.number().int().positive().optional(),

    perCustomerLimit:
      z.number().int().positive().optional(),

    validFrom:
      z.coerce.date().optional(),

    validUntil:
      z.coerce.date().optional(),

    applicableMenuItemIds:
      z.array(z.string()).optional(),

    applicableCategoryIds:
      z.array(z.string()).optional(),
  });

export const couponStatusSchema =
  z.object({
    isActive: z.boolean(),
  });

export const validateCouponSchema =
  z.object({
    restaurantId: z.string().min(1),

    branchId: z.string().optional(),

    code: z.string().min(1),

    orderAmount: z.number().positive(),
  });

export type CreateCouponInput =
  z.infer<typeof createCouponSchema>;

export type UpdateCouponInput =
  z.infer<typeof updateCouponSchema>;

export type ValidateCouponInput =
  z.infer<typeof validateCouponSchema>;