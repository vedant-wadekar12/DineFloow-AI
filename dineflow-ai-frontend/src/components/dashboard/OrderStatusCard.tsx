import {
  CheckCircle2,
  Clock3,
  LoaderCircle,
  XCircle,
} from "lucide-react";

import type { OrderStatusData } from "@/types/dashboard.types";

interface OrderStatusCardProps {
  data: OrderStatusData[];
}

const statusConfig = {
  Completed: {
    icon: CheckCircle2,
    className: "text-emerald-500 bg-emerald-50",
  },
  Preparing: {
    icon: LoaderCircle,
    className: "text-blue-500 bg-blue-50",
  },
  Pending: {
    icon: Clock3,
    className: "text-orange-500 bg-orange-50",
  },
  Cancelled: {
    icon: XCircle,
    className: "text-red-500 bg-red-50",
  },
};

function OrderStatusCard({
  data,
}: OrderStatusCardProps) {
  const total = data.reduce(
    (sum, item) => sum + item.value,
    0,
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div>
        <h2 className="font-semibold text-gray-900">
          Order Status
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Today's order distribution.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {data.map((item) => {
          const config =
            statusConfig[
              item.name as keyof typeof statusConfig
            ];

          const Icon = config.icon;

          const percentage = Math.round(
            (item.value / total) * 100,
          );

          return (
            <div key={item.name}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${config.className}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <span className="text-sm font-medium text-gray-700">
                    {item.name}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-900">
                    {item.value}
                  </span>

                  <span className="ml-2 text-xs text-gray-400">
                    {percentage}%
                  </span>
                </div>
              </div>

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-[#FF6B35]"
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OrderStatusCard;