import ModulePage from "@/components/workspace/ModulePage";
import ContractNotice from "@/components/workspace/ContractNotice";
export default function Notifications() { return <ModulePage title="Notifications" description="Stay on top of restaurant events, alerts, and staff updates." metrics={[{label:"Unread",value:"—"},{label:"Today",value:"—"},{label:"Critical",value:"—"}]}><ContractNotice module="Notifications" /></ModulePage>; }
