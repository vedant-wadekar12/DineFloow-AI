import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Building2, CheckCircle2, CreditCard, ShieldAlert, ShieldCheck, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { getRestaurants } from "@/services/restaurants/restaurant.service";
import type { Restaurant } from "@/types/restaurant.types";
import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";

/**
 * Preview mode deliberately contains no mock production data.
 * It reads the same documented restaurant API used by the live admin area.
 */
export default function PlatformAdminPreview() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await getRestaurants();
      setRestaurants(response.restaurants);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const counts = useMemo(
    () => ({
      total: restaurants.length,
      active: restaurants.filter((item) => item.status === "ACTIVE").length,
      inactive: restaurants.filter((item) => item.status === "INACTIVE").length,
      suspended: restaurants.filter((item) => item.status === "SUSPENDED").length,
    }),
    [restaurants],
  );

  if (loading) return <LoadingState message="Loading real platform data..." />;

  if (error) {
    return (
      <ErrorState
        title="Platform data unavailable"
        description="The admin preview cannot display restaurant data because the documented backend API did not return it. No fake data is shown."
        action={
          <button
            type="button"
            onClick={() => void load()}
            className="rounded-xl bg-[#FF6B35] px-4 py-2 text-sm font-semibold text-white"
          >
            Retry
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-7">
      <section className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-[#FF6B35]">
            <ShieldCheck className="h-4 w-4" />
            Platform Administration
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            DineFlow control center
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            This view contains only data returned by the DineFlow backend. No restaurant names, counts, payments, subscriptions, permissions, or audit events are fabricated in the frontend.
          </p>
        </div>
        <Link
          to="/login"
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#FF6B35] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e85d2d]"
        >
          Sign in <ArrowUpRight className="h-4 w-4" />
        </Link>
      </section>

      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
        <strong>Real-data mode:</strong> platform restaurant metrics below are calculated from the authenticated backend response.
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Restaurants" value={counts.total} icon={Building2} />
        <Metric label="Active" value={counts.active} icon={CheckCircle2} />
        <Metric label="Inactive" value={counts.inactive} icon={XCircle} />
        <Metric label="Suspended / hold" value={counts.suspended} icon={ShieldAlert} />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <ModuleLink href="/preview/accounts" title="Restaurant accounts" description="Open the real restaurant account control surface." icon={Building2} />
        <ModuleLink href="/preview/subscriptions" title="Subscription review" description="Open the subscription contract status. No fake payment data is shown." icon={CreditCard} />
        <ModuleLink href="/preview/access" title="Access & permissions" description="Open the permission contract status. No invented permissions are shown." icon={ShieldCheck} />
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-950">Restaurant accounts</h2>
          <p className="mt-1 text-sm text-slate-500">Live records returned by the restaurant API.</p>
        </div>
        {restaurants.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">No restaurant accounts were returned by the backend.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {restaurants.slice(0, 10).map((restaurant) => (
              <div key={restaurant.id} className="grid gap-2 px-6 py-4 sm:grid-cols-[1.5fr_1fr_140px] sm:items-center">
                <div>
                  <p className="font-semibold text-slate-900">{restaurant.name || "Unnamed restaurant"}</p>
                  <p className="text-xs text-slate-500">{restaurant.slug || restaurant.id}</p>
                </div>
                <span className="text-sm text-slate-600">{restaurant.city || restaurant.state || "—"}</span>
                <span className="w-fit rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{restaurant.status}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Link to="/preview/audit" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-orange-200">
          <ShieldCheck className="h-5 w-5 text-[#FF6B35]" />
          <h3 className="mt-4 font-bold text-slate-950">Audit & controls</h3>
          <p className="mt-1 text-sm leading-6 text-slate-500">Open the audit surface. It will never display fabricated activity.</p>
        </Link>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Access suspension rule</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            The admin can send the documented restaurant status mutation to suspend an account. Whether a suspended restaurant is actually blocked from login/API use is enforced by the backend, not by this UI.
          </p>
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Building2 }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-[#FF6B35]"><Icon className="h-5 w-5" /></div>
      <p className="mt-4 text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-bold text-slate-950">{value}</p>
    </div>
  );
}

function ModuleLink({ href, title, description, icon: Icon }: { href: string; title: string; description: string; icon: typeof Building2 }) {
  return (
    <Link to={href} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200">
      <div className="flex items-center justify-between"><Icon className="h-5 w-5 text-[#FF6B35]" /><ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-[#FF6B35]" /></div>
      <h3 className="mt-4 font-bold text-slate-950">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
    </Link>
  );
}
