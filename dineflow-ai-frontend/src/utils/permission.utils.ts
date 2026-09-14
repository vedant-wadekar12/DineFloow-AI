import type { User } from "@/types/auth.types";

export function hasPermission(
  user: User | null,
  permission: string,
): boolean {
  if (!user) {
    return false;
  }

  // Super admin has everything.
  if (
    user.role === "SUPER_ADMIN" ||
    user.roles?.includes("SUPER_ADMIN")
  ) {
    return true;
  }

  // Restaurant owner can manage restaurant data.
  if (
    user.role === "RESTAURANT_OWNER" ||
    user.roles?.includes("RESTAURANT_OWNER")
  ) {
    if (
      permission === "restaurant:create" ||
      permission === "restaurant:read" ||
      permission === "restaurant:update" ||
      permission === "restaurant:delete"
    ) {
      return true;
    }
  }

  // Wildcard permission.
  if (
    user.permissions?.includes("*")
  ) {
    return true;
  }

  // Normal permission check.
  return Boolean(
    user.permissions?.includes(
      permission,
    ),
  );
}

export function hasAnyPermission(
  user: User | null,
  permissions: string[],
): boolean {
  return permissions.some(
    (permission) =>
      hasPermission(user, permission),
  );
}