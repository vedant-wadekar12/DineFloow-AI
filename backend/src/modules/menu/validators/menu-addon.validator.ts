import { z } from "zod";

export const createMenuAddonSchema =
  z.object({
    restaurantId: z.string().min(1),

    branchId: z.string().min(1).optional(),

    name: z.string().min(1).max(100).trim(),

    description: z
      .string()
      .max(500)
      .trim()
      .optional(),

    price: z.number().min(0),
  });

export const updateMenuAddonSchema =
  z.object({
    branchId: z.string().min(1).optional(),

    name: z
      .string()
      .min(1)
      .max(100)
      .trim()
      .optional(),

    description: z
      .string()
      .max(500)
      .trim()
      .optional(),

    price: z.number().min(0).optional(),
  });

export const updateMenuAddonAvailabilitySchema =
  z.object({
    isAvailable: z.boolean(),
  });