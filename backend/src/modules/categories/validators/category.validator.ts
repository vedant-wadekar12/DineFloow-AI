import { z } from "zod";

export const createCategorySchema = z.object({
  restaurantId: z.string().min(1),

  branchId: z.string().min(1).optional(),

  name: z
    .string()
    .trim()
    .min(2)
    .max(100),

  slug: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers and hyphens."
    ),

  description: z
    .string()
    .trim()
    .max(500)
    .optional(),

  image: z
    .string()
    .trim()
    .max(500)
    .optional(),

  sortOrder: z
    .number()
    .int()
    .min(0)
    .optional(),
});

export const updateCategorySchema =
  createCategorySchema
    .omit({
      restaurantId: true,
      branchId: true,
    })
    .partial();

export const updateCategoryStatusSchema =
  z.object({
    isActive: z.boolean(),
  });