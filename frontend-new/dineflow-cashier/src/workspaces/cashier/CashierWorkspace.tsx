import { CreditCard, Receipt, WalletCards } from "lucide-react";
import ContractNotice from "@/components/workspace/ContractNotice";

export default function CashierWorkspace() {
  return <div className="space-y-6">
    <div><p className="text-sm font-semibold text-[#FF6B35]">Cashier Workspace</p><h1 className="mt-1 text-3xl font-bold text-slate-950">Billing & payments</h1><p className="mt-2 text-sm text-slate-500">A dedicated operational surface for CASHIER accounts.</p></div>
    <div className="grid gap-4 sm:grid-cols-3">{[{label:"Open bills",icon:Receipt},{label:"Payment queue",icon:CreditCard},{label:"Today",icon:WalletCards}].map(({label,icon:Icon}) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><Icon className="h-5 w-5 text-[#FF6B35]" /><p className="mt-4 text-sm text-slate-500">{label}</p><p className="mt-1 text-2xl font-bold">—</p></div>)}</div>
    <ContractNotice module="the billing and payment workflow" />
  </div>;
}
