import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import RoleRequired from "@/app/RoleRequired";

interface Props { expectedRoles: string[]; dashboardPath: string; appName: string; }

export default function RoleLanding({ expectedRoles, dashboardPath, appName }: Props) {
  const { user } = useAuth();
  const role = user?.role ?? user?.roles?.[0] ?? null;
  const allowed = Boolean(role && expectedRoles.includes(role));
  if (allowed) return <Navigate to={dashboardPath} replace />;
  return <RoleRequired appName={appName} expectedRoles={expectedRoles} />;
}
