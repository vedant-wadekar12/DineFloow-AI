import { z } from "zod";

export const createQRSchema = z.object({
  restaurantId: z.string().min(1, "Restaurant ID is required"),

  branchId: z.string().min(1, "Branch ID is required"),

  floorId: z.string().min(1, "Floor ID is required"),

  tableId: z.string().min(1, "Table ID is required"),
});

export const updateQRStatusSchema = z.object({
  isActive: z.boolean(),
});