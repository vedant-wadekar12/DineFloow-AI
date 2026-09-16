import { z } from "zod";

export const createPlanSchema =
  z.object({
    name: z.string().min(2).max(100),

    code: z.string().min(2).max(30),

    description:
      z.string().max(500).optional(),

    monthlyPrice:
      z.number().min(0),

    yearlyPrice:
      z.number().min(0),

    features:
      z.array(z.string()).default([]),

    limits: z.object({
      branches:
        z.number().int().positive().optional(),

      tables:
        z.number().int().positive().optional(),

      employees:
        z.number().int().positive().optional(),

      menuItems:
        z.number().int().positive().optional(),

      ordersPerMonth:
        z.number().int().positive().optional(),
    }).default({}),

    sortOrder:
      z.number().int().min(0).default(0),
  });

export const updatePlanSchema =
  createPlanSchema.partial();

export const createSubscriptionSchema =
  z.object({
    restaurantId: z.string().min(1),

    planId: z.string().min(1),

    billingCycle: z.enum([
      "MONTHLY",
      "YEARLY",
    ]),

    trialDays:
      z.number().int().min(0).max(90).default(0),
  });

export const changePlanSchema =
  z.object({
    planId: z.string().min(1),

    billingCycle: z.enum([
      "MONTHLY",
      "YEARLY",
    ]),
  });

export const cancelSubscriptionSchema =
  z.object({
    cancelImmediately:
      z.boolean().default(false),
  });

export type CreatePlanInput =
  z.infer<typeof createPlanSchema>;

export type CreateSubscriptionInput =
  z.infer<typeof createSubscriptionSchema>;

export type ChangePlanInput =
  z.infer<typeof changePlanSchema>;