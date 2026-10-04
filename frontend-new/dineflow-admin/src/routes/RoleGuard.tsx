import type { ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/types/auth.types";

interface RoleGuardProps {
  roles: UserRole[];
  children?: ReactNode;
}

export default function RoleGuard({ roles, children }: RoleGuardProps) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const userRoles = user.roles ?? (user.role ? [user.role] : []);
  const allowed = userRoles.some((role) => roles.includes(role));

  if (!allowed) {
    return <Navigate to="/unauthorized" replace state={{ from: location }} />;
  }

  return children ?? <Outlet />;
}
