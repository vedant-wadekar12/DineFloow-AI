import type { User } from "@/types/auth.types";

/**
 * Frontend permission checks are visibility hints only.
 * Backend authorization remains authoritative.
 */
export function hasPermission(
  user: User | null,
  permission: string,
): boolean {
  if (!user) return false;
  return Boolean(user.permissions?.includes(permission) || user.permissions?.includes("*"));
}

export function hasAnyPermission(
  user: User | null,
  permissions: string[],
): boolean {
  return permissions.some((permission) => hasPermission(user, permission));
}
