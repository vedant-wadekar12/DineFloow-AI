import { Link, Navigate } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/types/auth.types";

function getRole(user: { role?: UserRole; roles?: UserRole[] } | null): UserRole | null {
  return user?.role ?? user?.roles?.[0] ?? null;
}

export default function RoleLanding() {
  const { user } = useAuth();
  const role = getRole(user);

  switch (role) {
    case "SUPER_ADMIN":
      return <Navigate to="/platform-admin" replace />;
    case "WAITER":
      return <Navigate to="/waiter" replace />;
    case "CHEF":
    case "KITCHEN_STAFF":
      return <Navigate to="/chef" replace />;
    case "CASHIER":
      return <Navigate to="/cashier" replace />;
    case "RESTAURANT_OWNER":
    case "BRANCH_MANAGER":
      return <Navigate to="/workspace" replace />;
    default:
      return (
        <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center p-6">
          <div className="w-full rounded-3xl border border-amber-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600"><ShieldAlert className="h-7 w-7" /></div>
            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.14em] text-[#FF6B35]">DineFlow access</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-950">Your account role is not available</h1>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">The frontend cannot safely guess whether this account belongs to a platform administrator, restaurant operator, chef, waiter, or cashier. The authenticated API must provide `role` or `roles`.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/platform-admin/preview" className="rounded-xl border border-slate-200 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white">Preview Platform Admin</Link>
              <Link to="/workspace" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800">Open Restaurant Workspace</Link>
            </div>
          </div>
        </div>
      );
  }
}
