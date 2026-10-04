import {
  Armchair,
  CheckCircle2,
  Clock3,
  Sparkles,
} from "lucide-react";

import type { TableStatusData } from "@/types/dashboard.types";

interface TableStatusCardProps {
  data: TableStatusData[];
}

const config = {
  Available: {
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-600",
  },
  Occupied: {
    icon: Armchair,
    className: "bg-orange-50 text-orange-600",
  },
  Reserved: {
    icon: Clock3,
    className: "bg-blue-50 text-blue-600",
  },
  Cleaning: {
    icon: Sparkles,
    className: "bg-purple-50 text-purple-600",
  },
};

function TableStatusCard({
  data,
}: TableStatusCardProps) {
  const total = data.reduce(
    (sum, item) => sum + item.count,
    0,
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-900">
            Table Status
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Current floor activity.
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 px-3 py-2">
          <p className="text-xs text-gray-400">
            Total
          </p>

          <p className="text-lg font-bold text-gray-900">
            {total}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {data.map((item) => {
          const itemConfig =
            config[
              item.status as keyof typeof config
            ];

          const Icon = itemConfig.icon;

          return (
            <div
              key={item.status}
              className="rounded-xl border border-gray-100 p-4"
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${itemConfig.className}`}
              >
                <Icon className="h-4 w-4" />
              </div>

              <p className="mt-3 text-xs text-gray-500">
                {item.status}
              </p>

              <p className="mt-1 text-xl font-bold text-gray-900">
                {item.count}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TableStatusCard;