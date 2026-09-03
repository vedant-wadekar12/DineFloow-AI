import { z } from "zod";

export const createBranchSchema = z.object({
  restaurantId: z.string().min(1),

  name: z
    .string()
    .trim()
    .min(2)
    .max(100),

  code: z
    .string()
    .trim()
    .min(2)
    .max(20)
    .regex(
      /^[A-Za-z0-9_-]+$/,
      "Branch code contains invalid characters."
    ),

  phone: z
    .string()
    .trim()
    .min(7)
    .max(20),

  email: z
    .string()
    .trim()
    .email()
    .optional(),

  address: z
    .string()
    .trim()
    .min(5)
    .max(300),
});

export const updateBranchSchema =
  createBranchSchema
    .omit({
      restaurantId: true,
    })
    .partial();

export const updateBranchStatusSchema =
  z.object({
    isActive: z.boolean(),
  });

export const assignBranchManagerSchema =
  z.object({
    managerId: z.string().min(1),
  });