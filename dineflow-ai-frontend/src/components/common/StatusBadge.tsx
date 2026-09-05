import { Badge } from "@/components/ui/badge";

type Status =
  | "active"
  | "inactive"
  | "pending"
  | "completed"
  | "cancelled"
  | "available"
  | "unavailable"
  | "paid"
  | "unpaid"
  | "preparing"
  | "ready";

interface StatusBadgeProps {
  status: Status;
}

const statusConfig: Record<
  Status,
  {
    label: string;
    className: string;
  }
> = {
  active: {
    label: "Active",
    className: "bg-[#06D6A0]/10 text-[#059669]",
  },

  inactive: {
    label: "Inactive",
    className: "bg-gray-100 text-gray-600",
  },

  pending: {
    label: "Pending",
    className: "bg-[#FFB703]/15 text-[#B45309]",
  },

  completed: {
    label: "Completed",
    className: "bg-[#06D6A0]/10 text-[#059669]",
  },

  cancelled: {
    label: "Cancelled",
    className: "bg-red-100 text-red-600",
  },

  available: {
    label: "Available",
    className: "bg-[#06D6A0]/10 text-[#059669]",
  },

  unavailable: {
    label: "Unavailable",
    className: "bg-red-100 text-red-600",
  },

  paid: {
    label: "Paid",
    className: "bg-[#06D6A0]/10 text-[#059669]",
  },

  unpaid: {
    label: "Unpaid",
    className: "bg-red-100 text-red-600",
  },

  preparing: {
    label: "Preparing",
    className: "bg-blue-100 text-blue-600",
  },

  ready: {
    label: "Ready",
    className: "bg-[#06D6A0]/10 text-[#059669]",
  },
};

function StatusBadge({
  status,
}: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge
      variant="outline"
      className={config.className}
    >
      {config.label}
    </Badge>
  );
}

export default StatusBadge;