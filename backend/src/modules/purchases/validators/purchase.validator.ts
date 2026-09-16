import { z } from "zod";

export const createPurchaseSchema = z.object({
  restaurantId: z.string().min(1),

  branchId: z.string().min(1).optional(),

  supplierId: z.string().min(1),

  purchaseDate: z.coerce.date().optional(),

  expectedDate: z.coerce.date().optional(),

  items: z.array(
    z.object({
      inventoryItemId: z.string().min(1),

      quantity: z.number().positive(),

      receivedQuantity:
        z.number().nonnegative().optional(),

      unitCost:
        z.number().nonnegative(),

      totalCost:
        z.number().nonnegative().optional(),

      notes:
        z.string().optional(),
    })
  ).min(1),

  taxAmount:
    z.number().nonnegative().optional(),

  discountAmount:
    z.number().nonnegative().optional(),

  shippingAmount:
    z.number().nonnegative().optional(),

  notes:
    z.string().optional(),
});


export const updatePurchaseSchema = z.object({
  branchId:
    z.string().min(1).optional(),

  supplierId:
    z.string().min(1).optional(),

  purchaseDate:
    z.coerce.date().optional(),

  expectedDate:
    z.coerce.date().optional(),

  items: z.array(
    z.object({
      inventoryItemId:
        z.string().min(1),

      quantity:
        z.number().positive(),

      receivedQuantity:
        z.number().nonnegative().optional(),

      unitCost:
        z.number().nonnegative(),

      totalCost:
        z.number().nonnegative().optional(),

      notes:
        z.string().optional(),
    })
  ).min(1).optional(),

  taxAmount:
    z.number().nonnegative().optional(),

  discountAmount:
    z.number().nonnegative().optional(),

  shippingAmount:
    z.number().nonnegative().optional(),

  notes:
    z.string().optional(),
});


export const updatePurchaseStatusSchema =
  z.object({
    status: z.enum([
      "DRAFT",
      "ORDERED",
      "CANCELLED",
    ]),
  });