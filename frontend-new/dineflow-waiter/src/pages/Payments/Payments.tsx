import ModulePage from "@/components/workspace/ModulePage";
import ContractNotice from "@/components/workspace/ContractNotice";
export default function Payments() { return <ModulePage title="Payments" description="Track cash and online payment states without trusting frontend totals." metrics={[{label:"Pending",value:"—"},{label:"Successful",value:"—"},{label:"Failed",value:"—"},{label:"Refunds",value:"—"}]}><ContractNotice module="Payments" /></ModulePage>; }
