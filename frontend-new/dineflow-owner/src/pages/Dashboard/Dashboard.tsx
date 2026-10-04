import { Link } from "react-router-dom";
import { BarChart3, Building2, ChefHat, ClipboardList, Grid2X2, Package, ShoppingCart, Sparkles, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRestaurant } from "@/context/RestaurantContext";
import ContractNotice from "@/components/workspace/ContractNotice";

const modules = [
  { label: "Restaurant", href: "/restaurants", icon: Building2, roles: ["RESTAURANT_OWNER"] },
  { label: "Branches", href: "/branches", icon: Building2, roles: ["RESTAURANT_OWNER", "BRANCH_MANAGER"] },
  { label: "Tables", href: "/tables", icon: Grid2X2, roles: ["RESTAURANT_OWNER", "BRANCH_MANAGER"] },
  { label: "Menu", href: "/menu", icon: ClipboardList, roles: ["RESTAURANT_OWNER", "BRANCH_MANAGER"] },
  { label: "Inventory", href: "/inventory", icon: Package, roles: ["RESTAURANT_OWNER", "BRANCH_MANAGER"] },
  { label: "Orders", href: "/orders", icon: ShoppingCart, roles: ["RESTAURANT_OWNER", "BRANCH_MANAGER"] },
  { label: "Kitchen", href: "/chef", icon: ChefHat, roles: ["RESTAURANT_OWNER", "BRANCH_MANAGER"] },
  { label: "Analytics", href: "/analytics", icon: BarChart3, roles: ["RESTAURANT_OWNER", "BRANCH_MANAGER"] },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { selectedRestaurant, isLoading: restaurantLoading } = useRestaurant();
  const role = user?.role ?? user?.roles?.[0];
  const visibleModules = role ? modules.filter((module) => module.roles.includes(role)) : [];
  const displayName = user?.firstName ?? user?.name ?? user?.email?.split("@")[0] ?? "there";

  return (
    <div className="space-y-7">
      <header>
        <p className="text-sm font-semibold text-[#FF6B35]">Restaurant Operations</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">Good morning, {displayName}</h1>
        <p className="mt-2 text-sm text-slate-500">Your workspace is connected to the DineFlow backend. Live metrics appear only when their documented API contracts are available.</p>
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Current restaurant</p>
            <h2 className="mt-2 text-xl font-bold text-slate-950">{restaurantLoading ? "Loading…" : selectedRestaurant?.name ?? "No restaurant selected"}</h2>
            <p className="mt-1 text-sm text-slate-500">{selectedRestaurant?.city ? `${selectedRestaurant.city}${selectedRestaurant.state ? `, ${selectedRestaurant.state}` : ""}` : "Select or create a restaurant to begin operations."}</p>
          </div>
          {role === "RESTAURANT_OWNER" && <Link to="/restaurants" className="inline-flex items-center justify-center rounded-xl bg-[#FF6B35] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#e85d2d]">Manage restaurant</Link>}
        </div>
      </section>

      <ContractNotice module="dashboard analytics and KPI aggregation" />

      <section>
        <div className="flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Operations</p><h2 className="mt-1 text-xl font-bold text-slate-950">Quick access</h2></div><span className="text-xs text-slate-400">Role: {role ?? "Not returned"}</span></div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {visibleModules.map(({ label, href, icon: Icon }) => <Link key={href} to={href} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#FF6B35]"><Icon className="h-5 w-5" /></div><p className="mt-4 font-semibold text-slate-900">{label}</p><p className="mt-1 text-xs text-slate-500">Open module</p></Link>)}
          {visibleModules.length === 0 && <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500"><Users className="mx-auto h-6 w-6" /><p className="mt-2">No owner/manager dashboard modules are assigned to this role.</p></div>}
        </div>
      </section>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600"><Sparkles className="mb-2 h-5 w-5 text-[#FF6B35]" /><strong className="text-slate-900">No fake dashboard numbers.</strong> DineFlow will render revenue, order, customer, kitchen and table metrics only after the corresponding backend API contracts are connected.</div>
    </div>
  );
}
