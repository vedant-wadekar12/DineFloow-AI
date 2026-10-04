import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, PauseCircle, RefreshCw, ShieldCheck, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";
import { getRestaurants, updateRestaurantStatus } from "@/services/restaurants/restaurant.service";
import type { Restaurant, RestaurantStatus } from "@/types/restaurant.types";

export default function AccountActivation() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getRestaurants();
      setRestaurants(response.restaurants);
    } catch {
      setError("Unable to load restaurant accounts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const counts = useMemo(() => ({
    active: restaurants.filter((r) => r.status === "ACTIVE").length,
    inactive: restaurants.filter((r) => r.status === "INACTIVE").length,
    suspended: restaurants.filter((r) => r.status === "SUSPENDED").length,
  }), [restaurants]);

  const changeStatus = async (restaurant: Restaurant, status: RestaurantStatus) => {
    try {
      setUpdating(restaurant.id);
      const updated = await updateRestaurantStatus(restaurant.id, status);
      setRestaurants((current) => current.map((item) => item.id === updated.id ? updated : item));
    } catch {
      setError(`Unable to change ${restaurant.name}'s account status.`);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <LoadingState message="Loading restaurant accounts..." />;
  if (error && restaurants.length === 0) return <ErrorState title="Account activation unavailable" description={error} action={<Button onClick={() => void load()}><RefreshCw className="mr-2 h-4 w-4" />Retry</Button>} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3"><div className="rounded-2xl bg-orange-50 p-3"><ShieldCheck className="h-6 w-6 text-[#FF6B35]" /></div><div><p className="text-sm font-semibold text-[#FF6B35]">Platform Administration</p><h1 className="text-2xl font-bold text-gray-900">Restaurant Account Activation</h1><p className="text-sm text-gray-500">Activate, suspend or deactivate restaurant accounts before owners and staff operate them.</p></div></div>
        <Button variant="outline" onClick={() => void load()}><RefreshCw className="mr-2 h-4 w-4" />Refresh</Button>
      </div>
      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      <div className="grid gap-4 sm:grid-cols-3"><div className="rounded-2xl border bg-white p-5 shadow-sm"><CheckCircle2 className="h-5 w-5 text-[#06D6A0]" /><p className="mt-3 text-sm text-gray-500">Active accounts</p><p className="text-3xl font-bold">{counts.active}</p></div><div className="rounded-2xl border bg-white p-5 shadow-sm"><PauseCircle className="h-5 w-5 text-amber-500" /><p className="mt-3 text-sm text-gray-500">Inactive accounts</p><p className="text-3xl font-bold">{counts.inactive}</p></div><div className="rounded-2xl border bg-white p-5 shadow-sm"><XCircle className="h-5 w-5 text-red-500" /><p className="mt-3 text-sm text-gray-500">Suspended accounts</p><p className="text-3xl font-bold">{counts.suspended}</p></div></div>
      {restaurants.length === 0 ? <EmptyState title="No restaurant accounts" description="Restaurant accounts will appear here after they are created." /> : <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="border-b bg-gray-50 text-left text-gray-500"><tr><th className="px-5 py-3 font-medium">Restaurant</th><th className="px-5 py-3 font-medium">Owner</th><th className="px-5 py-3 font-medium">Status</th><th className="px-5 py-3 text-right font-medium">Account action</th></tr></thead><tbody className="divide-y">{restaurants.map((restaurant) => <tr key={restaurant.id}><td className="px-5 py-4"><p className="font-semibold text-gray-900">{restaurant.name}</p><p className="text-xs text-gray-500">{restaurant.slug}</p></td><td className="px-5 py-4 text-gray-600">{restaurant.ownerId ?? "—"}</td><td className="px-5 py-4"><span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold">{restaurant.status}</span></td><td className="px-5 py-4"><div className="flex justify-end gap-2">{restaurant.status !== "ACTIVE" && <Button size="sm" disabled={updating === restaurant.id} onClick={() => void changeStatus(restaurant, "ACTIVE")}>Activate</Button>}{restaurant.status === "ACTIVE" && <Button size="sm" variant="outline" disabled={updating === restaurant.id} onClick={() => void changeStatus(restaurant, "INACTIVE")}>Deactivate</Button>}{restaurant.status !== "SUSPENDED" && <Button size="sm" variant="outline" disabled={updating === restaurant.id} onClick={() => void changeStatus(restaurant, "SUSPENDED")}>Suspend</Button>}</div></td></tr>)}</tbody></table></div></div>}
    </div>
  );
}
