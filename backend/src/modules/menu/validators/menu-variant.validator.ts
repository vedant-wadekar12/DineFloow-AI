import { z } from "zod";

export const createMenuVariantSchema = z
  .object({
    menuItemId: z.string().min(1),
    restaurantId: z.string().min(1),

    branchId: z.string().min(1).optional(),

    name: z.string().min(1).max(100).trim(),

    description: z
      .string()
      .max(500)
      .trim()
      .optional(),

    price: z.number().min(0),

    discountPrice: z.number().min(0).optional(),

    sortOrder: z.number().int().min(0).optional(),
  })
  .refine(
    (data) =>
      data.discountPrice === undefined ||
      data.discountPrice <= data.price,
    {
      message:
        "Discount price cannot be greater than price.",
      path: ["discountPrice"],
    }
  );

export const updateMenuVariantSchema = z
  .object({
    branchId: z.string().min(1).optional(),

    name: z.string().min(1).max(100).trim().optional(),

    description: z
      .string()
      .max(500)
      .trim()
      .optional(),

    price: z.number().min(0).optional(),

    discountPrice: z.number().min(0).optional(),

    sortOrder: z.number().int().min(0).optional(),
  })
  .refine(
    (data) =>
      data.price === undefined ||
      data.discountPrice === undefined ||
      data.discountPrice <= data.price,
    {
      message:
        "Discount price cannot be greater than price.",
      path: ["discountPrice"],
    }
  );

export const updateMenuVariantAvailabilitySchema =
  z.object({
    isAvailable: z.boolean(),
  });