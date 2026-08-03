import { z } from "zod";

/**
 * Register Validation
 */
export const registerSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, "First name must be at least 2 characters")
      .max(50),

    lastName: z
      .string()
      .trim()
      .min(2, "Last name must be at least 2 characters")
      .max(50),

    email: z
      .string()
      .trim()
      .email("Invalid email address")
      .toLowerCase(),

    phone: z
      .string()
      .trim()
      .min(10, "Phone number is required")
      .max(15),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100),

    confirmPassword: z.string(),

    roleId: z.string(),

    restaurantId: z.string().optional(),

    branchId: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/**
 * Login Validation
 */
export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),

  password: z.string().min(1, "Password is required"),
});

/**
 * Refresh Token Validation
 */
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

/**
 * Forgot Password Validation
 */
export const forgotPasswordSchema = z.object({
  email: z.string().trim().email(),
});

/**
 * Reset Password Validation
 */
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),

    password: z.string().min(8),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });