import { z } from "zod";

export const createTableSchema = z.object({
  branchId: z.string().min(1),

  floorId: z.string().min(1),

  name: z
    .string()
    .trim()
    .min(1)
    .max(100),

  tableNumber: z
    .number()
    .int()
    .min(1),

  capacity: z
    .number()
    .int()
    .min(1)
    .max(50),

  position: z
    .object({
      x: z.number(),
      y: z.number(),
    })
    .optional(),
});

export const updateTableSchema =
  createTableSchema
    .omit({
      branchId: true,
      floorId: true,
    })
    .partial();

export const updateTableStatusSchema =
  z.object({
    status: z.enum([
      "AVAILABLE",
      "OCCUPIED",
      "RESERVED",
      "CLEANING",
      "OUT_OF_SERVICE",
    ]),
  });

export const updateTableActiveStatusSchema =
  z.object({
    isActive: z.boolean(),
  });