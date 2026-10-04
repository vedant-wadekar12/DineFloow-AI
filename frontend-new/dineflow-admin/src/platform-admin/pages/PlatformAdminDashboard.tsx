import { useEffect, useMemo, useState } from "react";
import { Building2, CircleCheck, CirclePause, ShieldAlert, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getRestaurants } from "@/services/restaurants/restaurant.service";
import type { Restaurant } from "@/types/restaurant.types";
import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";

export default function PlatformAdminDashboard() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setError(false);
      const result = await getRestaurants();
      setRestaurants(result.restaurants);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const counts = useMemo(() => ({
    total: restaurants.length,
    active: restaurants.filter((item) => item.status === "ACTIVE").length,
    inactive: restaurants.filter((item) => item.status === "INACTIVE").length,
    suspended: restaurants.filter((item) => item.status === "SUSPENDED").length,
  }), [restaurants]);

  if (loading) return <LoadingState message="Loading platform accounts..." />;
  if (error) return <ErrorState title="Platform data unavailable" description="The restaurant account list could not be loaded from the documented frontend API contract." action={<button type="button" onClick={() => void load()} className="rounded-xl bg-[#FF6B35] px-4 py-2 text-sm font-semibold text-white">Retry</button>} />;

  return (
    <div className="space-y-7">
      <div>
        <p className="text-sm font-semibold text-[#FF6B35]">Platform Administration</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">Control your DineFlow accounts</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-500">Manage restaurant account status from a separate platform-admin workspace using the documented restaurant status API. Subscription, payment, permission and audit data are shown only when their backend contracts are documented.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total restaurants", value: counts.total, icon: Building2, tone: "bg-slate-100 text-slate-700" },
          { label: "Active", value: counts.active, icon: CircleCheck, tone: "bg-emerald-50 text-emerald-600" },
          { label: "Inactive", value: counts.inactive, icon: CirclePause, tone: "bg-amber-50 text-amber-600" },
          { label: "Suspended / hold", value: counts.suspended, icon: ShieldAlert, tone: "bg-red-50 text-red-600" },
        ].map((item) => {
          const Icon = item.icon;
          return <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.tone}`}><Icon className="h-5 w-5" /></div><p className="mt-4 text-sm text-slate-500">{item.label}</p><p className="mt-1 text-3xl font-bold text-slate-950">{item.value}</p></div>;
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Link to="/platform-admin/accounts" className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200"><div className="flex items-center justify-between"><Building2 className="h-6 w-6 text-[#FF6B35]" /><ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:text-[#FF6B35]" /></div><h2 className="mt-5 font-bold text-slate-950">Restaurant accounts</h2><p className="mt-2 text-sm leading-6 text-slate-500">Activate, deactivate, or suspend accounts using the existing restaurant status API.</p></Link>
        <Link to="/platform-admin/subscriptions" className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200"><div className="flex items-center justify-between"><CirclePause className="h-6 w-6 text-amber-500" /><ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:text-[#FF6B35]" /></div><h2 className="mt-5 font-bold text-slate-950">Subscription review</h2><p className="mt-2 text-sm leading-6 text-slate-500">Open the subscription surface. It will never show fabricated payment or subscription records.</p></Link>
        <Link to="/platform-admin/access" className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200"><div className="flex items-center justify-between"><ShieldAlert className="h-6 w-6 text-blue-500" /><ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:text-[#FF6B35]" /></div><h2 className="mt-5 font-bold text-slate-950">Access & permissions</h2><p className="mt-2 text-sm leading-6 text-slate-500">Open the access surface. It will never invent platform permission mutations.</p></Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-950">Recent restaurant accounts</h2>
        <div className="mt-4 divide-y divide-slate-100">
          {restaurants.slice(0, 6).map((restaurant) => <div key={restaurant.id} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold text-slate-900">{restaurant.name}</p><p className="text-xs text-slate-500">{restaurant.slug || restaurant.id}</p></div><span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{restaurant.status}</span></div>)}
          {restaurants.length === 0 && <p className="py-8 text-center text-sm text-slate-500">No restaurant accounts found.</p>}
        </div>
      </div>
    </div>
  );
}
