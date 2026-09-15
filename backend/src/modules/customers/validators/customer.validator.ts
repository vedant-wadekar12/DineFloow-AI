import { z } from "zod";

const addressSchema = z.object({
  label: z
    .string()
    .min(1)
    .max(50)
    .trim(),

  addressLine1: z
    .string()
    .min(1)
    .max(200)
    .trim(),

  addressLine2: z
    .string()
    .max(200)
    .trim()
    .optional(),

  city: z
    .string()
    .max(100)
    .trim()
    .optional(),

  state: z
    .string()
    .max(100)
    .trim()
    .optional(),

  postalCode: z
    .string()
    .max(20)
    .trim()
    .optional(),

  country: z
    .string()
    .max(100)
    .trim()
    .optional(),

  isDefault: z
    .boolean()
    .optional(),
});

export const createCustomerSchema =
  z.object({
    restaurantId: z
      .string()
      .min(1),

    firstName: z
      .string()
      .min(2)
      .max(100)
      .trim(),

    lastName: z
      .string()
      .max(100)
      .trim()
      .optional(),

    email: z
      .email()
      .optional(),

    phone: z
      .string()
      .min(5)
      .max(30)
      .trim(),

    profileImage: z
      .string()
      .url()
      .optional(),

    addresses: z
      .array(addressSchema)
      .optional(),

    dateOfBirth: z.coerce
      .date()
      .optional(),

    notes: z
      .string()
      .max(1000)
      .trim()
      .optional(),
  });

export const updateCustomerSchema =
  z.object({
    firstName: z
      .string()
      .min(2)
      .max(100)
      .trim()
      .optional(),

    lastName: z
      .string()
      .max(100)
      .trim()
      .optional(),

    email: z
      .email()
      .optional(),

    phone: z
      .string()
      .min(5)
      .max(30)
      .trim()
      .optional(),

    profileImage: z
      .string()
      .url()
      .optional(),

    addresses: z
      .array(addressSchema)
      .optional(),

    dateOfBirth: z.coerce
      .date()
      .optional(),

    notes: z
      .string()
      .max(1000)
      .trim()
      .optional(),
  });

export const updateCustomerStatusSchema =
  z.object({
    status: z.enum([
      "ACTIVE",
      "INACTIVE",
      "BLOCKED",
    ]),
  });