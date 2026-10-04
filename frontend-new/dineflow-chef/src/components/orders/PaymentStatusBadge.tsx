import type {
  PaymentStatus,
} from "@/types/order.types";

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

const paymentConfig: Record<
  PaymentStatus,
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

  paid: {
    label: "Paid",
    className:
      "bg-green-100 text-green-700",
  },

  failed: {
    label: "Failed",
    className:
      "bg-red-100 text-red-700",
  },

  refunded: {
    label: "Refunded",
    className:
      "bg-gray-100 text-gray-700",
  },
};

export default function PaymentStatusBadge({
  status,
}: PaymentStatusBadgeProps) {
  const config =
    paymentConfig[status];

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}