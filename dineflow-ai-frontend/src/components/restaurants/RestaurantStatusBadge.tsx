import {
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

import type { RestaurantStatus } from "@/types/restaurant.types";

interface RestaurantStatusBadgeProps {
  status: RestaurantStatus;
}

function RestaurantStatusBadge({
  status,
}: RestaurantStatusBadgeProps) {
  const normalizedStatus = String(status).toUpperCase();

  const statusConfig: Record<
    string,
    {
      label: string;
      className: string;
      icon: typeof CheckCircle2;
    }
  > = {
    ACTIVE: {
      label: "Active",
      className:
        "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20",
      icon: CheckCircle2,
    },

    INACTIVE: {
      label: "Inactive",
      className:
        "bg-gray-100 text-gray-600 ring-1 ring-inset ring-gray-500/20",
      icon: XCircle,
    },

    PENDING: {
      label: "Pending",
      className:
        "bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20",
      icon: Clock3,
    },
  };

  const config = statusConfig[normalizedStatus];

  if (!config) {
    return (
      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
        {String(status)}
      </span>
    );
  }

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}

export default RestaurantStatusBadge;