import { z } from "zod";

export const assignPermissionSchema = z.object({
  permissionId: z.string().min(1),
});