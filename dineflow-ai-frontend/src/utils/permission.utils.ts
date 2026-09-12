import type { User } from "@/types/auth.types";

export function hasPermission(
  user: User | null,
  permission: string,
): boolean {
  if (!user) {
    return false;
  }

  if (
    user.permissions?.includes("*")
  ) {
    return true;
  }

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
  if (!user) {
    return false;
  }

  if (
    user.permissions?.includes("*")
  ) {
    return true;
  }

  return permissions.some(
    (permission) =>
      user.permissions?.includes(
        permission,
      ),
  );
}