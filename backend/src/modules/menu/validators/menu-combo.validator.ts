import { z } from "zod";

const comboItemSchema = z.object({
  menuItemId: z.string().min(1),
  quantity: z.number().int().min(1),
});

export const createMenuComboSchema = z
  .object({
    restaurantId: z.string().min(1),

    branchId: z.string().min(1).optional(),

    name: z.string().min(1).max(150).trim(),

    slug: z.string().min(1).max(150).trim(),

    description: z
      .string()
      .max(1000)
      .trim()
      .optional(),

    image: z.string().url().optional(),

    price: z.number().min(0),

    discountPrice: z.number().min(0).optional(),

    sortOrder: z.number().int().min(0).optional(),

    items: z
      .array(comboItemSchema)
      .min(1),
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

export const updateMenuComboSchema = z
  .object({
    branchId: z.string().min(1).optional(),

    name: z.string().min(1).max(150).trim().optional(),

    slug: z.string().min(1).max(150).trim().optional(),

    description: z
      .string()
      .max(1000)
      .trim()
      .optional(),

    image: z.string().url().optional(),

    price: z.number().min(0).optional(),

    discountPrice: z.number().min(0).optional(),

    sortOrder: z.number().int().min(0).optional(),

    items: z
      .array(comboItemSchema)
      .min(1)
      .optional(),
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

export const updateMenuComboAvailabilitySchema =
  z.object({
    isAvailable: z.boolean(),
  });