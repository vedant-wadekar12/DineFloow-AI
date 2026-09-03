import { z } from "zod";

export const createRestaurantSchema = z.object({
  name: z.string().trim().min(2).max(100),

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

  phone: z.string().trim().min(7).max(20),

  email: z.string().trim().email(),

  address: z.string().trim().min(5).max(300),
});

export const updateRestaurantSchema =
  createRestaurantSchema.partial();

export const updateRestaurantStatusSchema =
  z.object({
    isActive: z.boolean(),
  });