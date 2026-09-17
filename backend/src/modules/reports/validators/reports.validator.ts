import { z } from "zod";

export const reportQuerySchema = z.object({
  startDate: z
    .string()
    .datetime({
      offset: true,
    }),

  endDate: z
    .string()
    .datetime({
      offset: true,
    }),

  branchId: z
    .string()
    .optional(),
});

export type ReportQuery = z.infer<
  typeof reportQuerySchema
>;