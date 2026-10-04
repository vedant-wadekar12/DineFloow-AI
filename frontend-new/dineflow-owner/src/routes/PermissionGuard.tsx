import type { ReactNode } from "react";

import { Navigate } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";
import { hasPermission } from "@/utils/permission.utils";

interface PermissionGuardProps {
  permission: string;
  children: ReactNode;
}

function PermissionGuard({
  permission,
  children,
}: PermissionGuardProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // The backend is authoritative. Some valid auth responses (including
  // RESTAURANT_OWNER /auth/me responses) do not include a permissions array.
  // In that case the frontend must not invent a denial or redirect.
  if (user.permissions && !hasPermission(user, permission)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default PermissionGuard;