import ModulePage from "@/components/workspace/ModulePage";
import ContractNotice from "@/components/workspace/ContractNotice";

export default function Kitchen() {
  return <ModulePage title="Kitchen" description="Monitor preparation queues and kitchen operations in real time." metrics={[{label:"Queued",value:"—"},{label:"Preparing",value:"—"},{label:"Ready",value:"—"},{label:"Delayed",value:"—"}]}><ContractNotice module="the Kitchen workflow" /></ModulePage>;
}
