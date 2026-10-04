import ModulePage from "@/components/workspace/ModulePage";
import ContractNotice from "@/components/workspace/ContractNotice";
export default function Waiter() { return <ModulePage title="Waiter" description="Keep table service, serving queues, and floor operations coordinated." metrics={[{label:"Open tables",value:"—"},{label:"Pending service",value:"—"},{label:"Serving",value:"—"},{label:"Completed",value:"—"}]}><ContractNotice module="the Waiter workflow" /></ModulePage>; }
