import { z } from "zod";

export const updateSettingsSchema = z.object({
  currency: z.string().min(1).max(10).optional(),

  timezone: z.string().min(1).max(100).optional(),

  language: z.string().min(1).max(20).optional(),

  taxEnabled: z.boolean().optional(),

  taxPercentage: z
    .number()
    .min(0)
    .max(100)
    .optional(),

  serviceChargeEnabled: z.boolean().optional(),

  serviceChargePercentage: z
    .number()
    .min(0)
    .max(100)
    .optional(),

  orderSettings: z
    .object({
      allowDineIn: z.boolean().optional(),
      allowTakeaway: z.boolean().optional(),
      allowDelivery: z.boolean().optional(),
      allowOnlineOrdering: z.boolean().optional(),
      allowCashPayment: z.boolean().optional(),
      allowOnlinePayment: z.boolean().optional(),
    })
    .optional(),

  notificationSettings: z
    .object({
      orderNotifications: z.boolean().optional(),
      paymentNotifications: z.boolean().optional(),
      lowStockNotifications: z.boolean().optional(),
      marketingNotifications: z.boolean().optional(),
    })
    .optional(),

  loyaltySettings: z
    .object({
      enabled: z.boolean().optional(),
      pointsPerCurrency: z
        .number()
        .min(0)
        .optional(),
    })
    .optional(),

  isActive: z.boolean().optional(),
});