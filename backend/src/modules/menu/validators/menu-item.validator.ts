import { z } from "zod";

export const createMenuItemSchema = z
  .object({
    restaurantId: z.string().min(1),

    branchId: z.string().min(1).optional(),

    categoryId: z.string().min(1),

    name: z.string().trim().min(2).max(150),

    slug: z
      .string()
      .trim()
      .min(2)
      .max(150)
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must contain only lowercase letters, numbers and hyphens."
      ),

    description: z.string().trim().max(1000).optional(),

    type: z.enum([
      "FOOD",
      "BEVERAGE",
      "DESSERT",
      "OTHER",
    ]),

    price: z.number().min(0),

    discountPrice: z.number().min(0).optional(),

    image: z.string().trim().max(500).optional(),

    isVegetarian: z.boolean().optional(),

    isVegan: z.boolean().optional(),

    preparationTime: z.number().int().min(0).optional(),

    sortOrder: z.number().int().min(0).optional(),
  })
  .refine(
    (data) =>
      data.discountPrice === undefined ||
      data.discountPrice <= data.price,
    {
      message:
        "Discount price cannot be greater than the original price.",
      path: ["discountPrice"],
    }
  );

export const updateMenuItemSchema = z
  .object({
    categoryId: z.string().min(1).optional(),

    name: z.string().trim().min(2).max(150).optional(),

    slug: z
      .string()
      .trim()
      .min(2)
      .max(150)
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must contain only lowercase letters, numbers and hyphens."
      )
      .optional(),

    description: z.string().trim().max(1000).optional(),

    type: z
      .enum([
        "FOOD",
        "BEVERAGE",
        "DESSERT",
        "OTHER",
      ])
      .optional(),

    price: z.number().min(0).optional(),

    discountPrice: z.number().min(0).optional(),

    image: z.string().trim().max(500).optional(),

    isVegetarian: z.boolean().optional(),

    isVegan: z.boolean().optional(),

    preparationTime: z.number().int().min(0).optional(),

    sortOrder: z.number().int().min(0).optional(),
  })
  .refine(
    (data) =>
      data.discountPrice === undefined ||
      data.price === undefined ||
      data.discountPrice <= data.price,
    {
      message:
        "Discount price cannot be greater than the original price.",
      path: ["discountPrice"],
    }
  );

export const updateMenuItemAvailabilitySchema = z.object({
  isAvailable: z.boolean(),
});

export const updateMenuItemStatusSchema = z.object({
  isActive: z.boolean(),
});