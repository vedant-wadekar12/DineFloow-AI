import type {
  OrderStatus,
} from "@/types/order.types";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const statusConfig: Record<
  OrderStatus,
  {
    label: string;
    className: string;
  }
> = {
  pending: {
    label: "Pending",
    className:
      "bg-yellow-100 text-yellow-700",
  },

  confirmed: {
    label: "Confirmed",
    className:
      "bg-blue-100 text-blue-700",
  },

  preparing: {
    label: "Preparing",
    className:
      "bg-orange-100 text-orange-700",
  },

  ready: {
    label: "Ready",
    className:
      "bg-purple-100 text-purple-700",
  },

  served: {
    label: "Served",
    className:
      "bg-cyan-100 text-cyan-700",
  },

  completed: {
    label: "Completed",
    className:
      "bg-green-100 text-green-700",
  },

  cancelled: {
    label: "Cancelled",
    className:
      "bg-red-100 text-red-700",
  },
};

export default function OrderStatusBadge({
  status,
}: OrderStatusBadgeProps) {
  const config =
    statusConfig[status];

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}