import { CheckCircle2, CircleOff } from "lucide-react";


interface SupplierStatsBadgeProps {
  isActive: boolean;
}

function SupplierStatsBadge({
  isActive,
}: SupplierStatsBadgeProps) {
  if (isActive) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#06D6A0]/10 px-2.5 py-1 text-xs font-semibold text-[#087f5b]">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Active
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
      <CircleOff className="h-3.5 w-3.5" />
      Inactive
    </span>
  );
}

export default SupplierStatsBadge;