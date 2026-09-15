import { z } from "zod";

export const createEmployeeSchema = z.object({
  userId: z.string().min(1),

  restaurantId: z.string().min(1),

  branchId: z.string().min(1).optional(),

  employeeCode: z
    .string()
    .min(2)
    .max(50)
    .trim(),

  designation: z
    .string()
    .min(2)
    .max(100)
    .trim(),

  department: z
    .string()
    .max(100)
    .trim()
    .optional(),

  joiningDate: z.coerce.date().optional(),

  dateOfBirth: z.coerce.date().optional(),

  emergencyContactName: z
    .string()
    .max(100)
    .trim()
    .optional(),

  emergencyContactPhone: z
    .string()
    .max(30)
    .trim()
    .optional(),

  salary: z
    .number()
    .min(0)
    .optional(),

  notes: z
    .string()
    .max(1000)
    .trim()
    .optional(),
});

export const updateEmployeeSchema = z.object({
  branchId: z.string().min(1).optional(),

  employeeCode: z
    .string()
    .min(2)
    .max(50)
    .trim()
    .optional(),

  designation: z
    .string()
    .min(2)
    .max(100)
    .trim()
    .optional(),

  department: z
    .string()
    .max(100)
    .trim()
    .optional(),

  joiningDate: z.coerce.date().optional(),

  dateOfBirth: z.coerce.date().optional(),

  emergencyContactName: z
    .string()
    .max(100)
    .trim()
    .optional(),

  emergencyContactPhone: z
    .string()
    .max(30)
    .trim()
    .optional(),

  salary: z
    .number()
    .min(0)
    .optional(),

  notes: z
    .string()
    .max(1000)
    .trim()
    .optional(),
});

export const updateEmployeeStatusSchema = z.object({
  status: z.enum([
    "ACTIVE",
    "INACTIVE",
    "SUSPENDED",
    "TERMINATED",
  ]),
});