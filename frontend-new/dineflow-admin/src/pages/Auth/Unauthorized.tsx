import { ShieldAlert, LogOut, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function Unauthorized() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      navigate("/login", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Platform Admin access required" description="This application is reserved for SUPER_ADMIN accounts.">
      <div className="space-y-5">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-amber-600 shadow-sm">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-900">Current account</p>
          <p className="mt-1 break-all text-sm text-slate-600">{user?.email ?? "Authenticated user"}</p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-amber-700">
            {user?.role ?? user?.roles?.join(", ") ?? "Role unavailable"}
          </p>
        </div>

        <p className="text-sm leading-6 text-slate-600">
          Sign in with a backend-authorized SUPER_ADMIN account to access the DineFlow Platform Admin application.
          Your current account has not been granted that role.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button type="button" variant="outline" className="w-full" >
            <Link to="/login"><ArrowLeft className="mr-2 h-4 w-4" />Back to login</Link>
          </Button>
          <Button type="button" className="w-full bg-[#FF6B35] hover:bg-[#E85D2D]" onClick={() => void handleLogout()} disabled={loading}>
            <LogOut className="mr-2 h-4 w-4" />{loading ? "Signing out…" : "Sign out"}
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}
