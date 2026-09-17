import { z } from "zod";

export const auditQuerySchema =
  z.object({
    restaurantId:
      z.string().optional(),

    branchId:
      z.string().optional(),

    userId:
      z.string().optional(),

    resource:
      z.string().optional(),

    action:
      z.string().optional(),

    page:
      z.coerce
        .number()
        .int()
        .min(1)
        .default(1),

    limit:
      z.coerce
        .number()
        .int()
        .min(1)
        .max(100)
        .default(50),
  });