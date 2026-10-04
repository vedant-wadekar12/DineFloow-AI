import { ClipboardList, Clock3, Bell, UserRound, UtensilsCrossed } from "lucide-react";
import ContractNotice from "@/components/workspace/ContractNotice";

export default function StaffWorkspace() {
  return <div className="space-y-6">
    <div><p className="text-sm font-semibold text-[#FF6B35]">Staff Workspace</p><h1 className="mt-1 text-3xl font-bold text-slate-950">Your service workspace</h1><p className="mt-2 text-sm text-slate-500">A separate operational interface for restaurant staff accounts.</p></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[{label:"Assigned orders",icon:ClipboardList},{label:"Waiting tasks",icon:Clock3},{label:"Notifications",icon:Bell},{label:"My profile",icon:UserRound}].map(({label,icon:Icon}) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#FF6B35]"><Icon className="h-5 w-5" /></div><p className="mt-4 font-semibold text-slate-900">{label}</p><p className="mt-1 text-xs text-slate-500">Live count from the staff API</p></div>)}
    </div>
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center gap-3"><UtensilsCrossed className="h-5 w-5 text-[#FF6B35]" /><h2 className="font-bold">Today&apos;s service queue</h2></div><div className="mt-5 space-y-3"><div className="rounded-xl border border-dashed border-slate-200 p-5 text-center text-sm text-slate-500">No live staff queue is shown until the documented staff/order assignment contract is connected.</div></div></div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="font-bold">Quick staff actions</h2><div className="mt-4 grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-slate-50 p-4 text-sm font-medium">View assigned work</div><div className="rounded-xl bg-slate-50 p-4 text-sm font-medium">Open notifications</div><div className="rounded-xl bg-slate-50 p-4 text-sm font-medium">Update profile</div><div className="rounded-xl bg-slate-50 p-4 text-sm font-medium">Contact manager</div></div></div>
    </div>
    <ContractNotice module="the staff assignment and real-time service workflow" />
  </div>;
}
