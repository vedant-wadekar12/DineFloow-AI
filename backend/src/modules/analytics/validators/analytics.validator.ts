import { z } from "zod";

export const analyticsQuerySchema = z.object({
  restaurantId: z.string().min(1),

  branchId: z.string().optional(),

  startDate: z.coerce.date().optional(),

  endDate: z.coerce.date().optional(),
});

export const dateRangeSchema = z
  .object({
    restaurantId: z.string().min(1),

    branchId: z.string().optional(),

    startDate: z.coerce.date(),

    endDate: z.coerce.date(),
  })
  .refine(
    (data) => data.startDate <= data.endDate,
    {
      message:
        "Start date must be before or equal to end date.",
      path: ["startDate"],
    }
  );