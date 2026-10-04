import { Info } from "lucide-react";

interface ContractNoticeProps {
  module: string;
}

export default function ContractNotice({ module }: ContractNoticeProps) {
  return (
    <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      <Info className="mt-0.5 h-5 w-5 shrink-0" />
      <div>
        <p className="font-semibold">API integration boundary</p>
        <p className="mt-1">Frontend UI is prepared for {module}. No undocumented endpoint or response shape is assumed here.</p>
      </div>
    </div>
  );
}
