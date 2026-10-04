import { CheckCircle2, ChefHat, Clock3, Flame } from "lucide-react";
import ContractNotice from "@/components/workspace/ContractNotice";

export default function ChefWorkspace() {
  return <div className="space-y-6">
    <div><p className="text-sm font-semibold text-[#FF6B35]">Kitchen Workspace</p><h1 className="mt-1 text-3xl font-bold text-slate-950">Chef & kitchen operations</h1><p className="mt-2 text-sm text-slate-500">A dedicated interface for CHEF and KITCHEN_STAFF accounts.</p></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[{label:"Confirmed",icon:Clock3},{label:"Preparing",icon:Flame},{label:"Ready",icon:CheckCircle2},{label:"Kitchen",icon:ChefHat}].map(({label,icon:Icon}) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#FF6B35]"><Icon className="h-5 w-5" /></div><span className="text-2xl font-bold text-slate-900">—</span></div><p className="mt-4 text-sm font-semibold">{label}</p><p className="mt-1 text-xs text-slate-500">Live kitchen data</p></div>)}</div>
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><div><h2 className="font-bold text-slate-950">Kitchen order board</h2><p className="mt-1 text-sm text-slate-500">Confirmed → Preparing → Ready</p></div><ChefHat className="h-6 w-6 text-[#FF6B35]" /></div><div className="mt-6 grid gap-4 md:grid-cols-3"><div className="min-h-40 rounded-xl bg-slate-50 p-4"><p className="font-semibold">Confirmed</p></div><div className="min-h-40 rounded-xl bg-orange-50 p-4"><p className="font-semibold">Preparing</p></div><div className="min-h-40 rounded-xl bg-emerald-50 p-4"><p className="font-semibold">Ready</p></div></div></div>
    <ContractNotice module="the kitchen order-status and real-time Socket.IO workflow" />
  </div>;
}
