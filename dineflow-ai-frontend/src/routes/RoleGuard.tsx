import type { ReactNode } from "react";

import { Navigate } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";

import type { UserRole } from "@/types/auth.types";

interface RoleGuardProps {
  roles: UserRole[];
  children: ReactNode;
}

function RoleGuard({
  roles,
  children,
}: RoleGuardProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRoles =
    user.roles ??
    (user.role ? [user.role] : []);

  const allowed = userRoles.some(
    (role) => roles.includes(role),
  );

  if (!allowed) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default RoleGuard;