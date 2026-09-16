
import { z } from "zod";

export const createInventoryItemSchema =
  z.object({
    restaurantId: z.string().min(1),

    branchId: z.string().min(1).optional(),

    name: z.string().min(1).max(150).trim(),

    sku: z.string().min(1).max(50).trim(),

    type: z.enum([
      "RAW_MATERIAL",
      "PACKAGING",
      "BEVERAGE",
      "OTHER",
    ]),

    unit: z.enum([
      "KG",
      "G",
      "L",
      "ML",
      "PCS",
      "PACK",
      "BOX",
      "BOTTLE",
    ]),

    currentStock: z
      .number()
      .min(0)
      .optional(),

    minimumStock: z
      .number()
      .min(0)
      .optional(),

    maximumStock: z
      .number()
      .min(0)
      .optional(),

    costPrice: z
      .number()
      .min(0)
      .optional(),

    supplierId: z
      .string()
      .min(1)
      .optional(),

    description: z
      .string()
      .max(1000)
      .trim()
      .optional(),
  })
  .refine(
    (data) =>
      data.maximumStock === undefined ||
      data.minimumStock === undefined ||
      data.maximumStock >= data.minimumStock,
    {
      message:
        "Maximum stock must be greater than or equal to minimum stock.",
      path: ["maximumStock"],
    }
  );

export const updateInventoryItemSchema =
  z
    .object({
      branchId: z.string().min(1).optional(),

      name: z
        .string()
        .min(1)
        .max(150)
        .trim()
        .optional(),

      sku: z
        .string()
        .min(1)
        .max(50)
        .trim()
        .optional(),

      type: z
        .enum([
          "RAW_MATERIAL",
          "PACKAGING",
          "BEVERAGE",
          "OTHER",
        ])
        .optional(),

      unit: z
        .enum([
          "KG",
          "G",
          "L",
          "ML",
          "PCS",
          "PACK",
          "BOX",
          "BOTTLE",
        ])
        .optional(),

      minimumStock: z
        .number()
        .min(0)
        .optional(),

      maximumStock: z
        .number()
        .min(0)
        .optional(),

      costPrice: z
        .number()
        .min(0)
        .optional(),

      supplierId: z
        .string()
        .min(1)
        .optional(),

      description: z
        .string()
        .max(1000)
        .trim()
        .optional(),
    })
    .refine(
      (data) =>
        data.maximumStock === undefined ||
        data.minimumStock === undefined ||
        data.maximumStock >= data.minimumStock,
      {
        message:
          "Maximum stock must be greater than or equal to minimum stock.",
        path: ["maximumStock"],
      }
    );