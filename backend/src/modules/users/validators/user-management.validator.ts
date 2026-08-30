import { z } from "zod";

export const updateUserStatusSchema = z.object({
  isActive: z.boolean(),
});

export const updateUserRoleSchema = z.object({
  roleId: z.string().min(1, "Role ID is required."),
});