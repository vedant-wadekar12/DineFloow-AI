import type { CustomerStatus } from "@/types/customer.types";

interface CustomerStatusBadgeProps {
  status: CustomerStatus;
}

const statusConfig: Record<
  CustomerStatus,
  {
    label: string;
    className: string;
  }
> = {
  ACTIVE: {
    label: "Active",
    className:
      "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  },
  INACTIVE: {
    label: "Inactive",
    className:
      "bg-gray-100 text-gray-700 ring-gray-500/20",
  },
  BLOCKED: {
    label: "Blocked",
    className:
      "bg-red-50 text-red-700 ring-red-600/20",
  },
};

function CustomerStatusBadge({
  status,
}: CustomerStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-1",
        "text-xs font-semibold ring-1 ring-inset",
        config.className,
      ].join(" ")}
    >
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
}

export default CustomerStatusBadge;