import { z } from "zod";

export const createMenuRecipeSchema =
  z.object({
    restaurantId: z.string().min(1),

    menuItemId: z.string().min(1),

    inventoryItemId: z.string().min(1),

    quantity: z.number().positive(),
  });

export const updateMenuRecipeSchema =
  z.object({
    quantity: z.number().positive(),
  });