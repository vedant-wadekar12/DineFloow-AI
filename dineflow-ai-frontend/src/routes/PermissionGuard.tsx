import type { ReactNode } from "react";

import { Navigate } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";

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

  const hasPermission =
    user.permissions?.includes(
      permission,
    ) ?? false;

  if (!hasPermission) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default PermissionGuard;