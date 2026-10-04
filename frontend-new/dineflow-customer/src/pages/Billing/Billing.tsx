import ModulePage from "@/components/workspace/ModulePage";
import ContractNotice from "@/components/workspace/ContractNotice";
export default function Billing() { return <ModulePage title="Billing" description="Review bills, balances, taxes, discounts, and payment status." metrics={[{label:"Open bills",value:"—"},{label:"Paid",value:"—"},{label:"Due",value:"—"},{label:"Today",value:"—"}]}><ContractNotice module="Billing" /></ModulePage>; }
