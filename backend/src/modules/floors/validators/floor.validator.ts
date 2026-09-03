import { z } from "zod";

export const createFloorSchema = z.object({
  branchId: z.string().min(1),

  name: z
    .string()
    .trim()
    .min(2)
    .max(100),

  code: z
    .string()
    .trim()
    .min(1)
    .max(20)
    .regex(
      /^[A-Za-z0-9_-]+$/,
      "Floor code contains invalid characters."
    ),

  description: z
    .string()
    .trim()
    .max(300)
    .optional(),

  floorNumber: z
    .number()
    .int()
    .min(0),
});

export const updateFloorSchema =
  createFloorSchema
    .omit({
      branchId: true,
    })
    .partial();

export const updateFloorStatusSchema =
  z.object({
    isActive: z.boolean(),
  });