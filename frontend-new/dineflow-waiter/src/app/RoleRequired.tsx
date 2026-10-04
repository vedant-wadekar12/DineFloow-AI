import { ShieldAlert, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface RoleRequiredProps { appName: string; expectedRoles: string[]; }

export default function RoleRequired({ appName, expectedRoles }: RoleRequiredProps) {
  const { user, logout } = useAuth();
  const actual = user?.role ?? user?.roles?.[0] ?? "ROLE_NOT_RETURNED";
  return (
    <div className="flex min-h-[70vh] items-center justify-center p-6">
      <div className="w-full max-w-2xl rounded-3xl border border-amber-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600"><ShieldAlert className="h-7 w-7" /></div>
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-[#FF6B35]">DineFlow access</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-950">This account does not belong to {appName}</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">The backend reported <strong>{actual}</strong>. This application accepts {expectedRoles.join(" or ")} accounts. No role is being guessed or changed in the browser.</p>
        <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-left text-sm"><p className="font-semibold text-slate-900">What to do</p><p className="mt-1 text-slate-500">Sign out and open the frontend assigned to your backend role, or ask the platform administrator to assign the correct backend role.</p></div>
        <button type="button" onClick={() => void logout()} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#111827] px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"><LogOut className="h-4 w-4" />Sign out</button>
      </div>
    </div>
  );
}
