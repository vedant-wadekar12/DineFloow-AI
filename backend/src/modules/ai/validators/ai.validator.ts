import { z } from "zod";

export const recommendationQuerySchema = z.object({
  restaurantId: z.string().min(1),

  customerId: z
    .string()
    .optional(),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(50)
    .default(10),
});

export const specialDishSchema = z.object({
  restaurantId: z.string().min(1),

  menuItemId: z.string().min(1),
});

export type RecommendationQuery = z.infer<
  typeof recommendationQuerySchema
>;

export type SpecialDishInput = z.infer<
  typeof specialDishSchema
>;