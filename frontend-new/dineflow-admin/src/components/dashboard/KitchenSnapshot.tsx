import {
  AlertTriangle,
  CheckCircle2,
  ChefHat,
  Clock3,
  Flame,
} from "lucide-react";

import type { KitchenSnapshotData } from "@/types/dashboard.types";

interface KitchenSnapshotProps {
  data: KitchenSnapshotData;
}

function KitchenSnapshot({
  data,
}: KitchenSnapshotProps) {
  const items = [
    {
      label: "Pending",
      value: data.pending,
      icon: Clock3,
      className: "bg-orange-50 text-orange-600",
    },
    {
      label: "Preparing",
      value: data.preparing,
      icon: Flame,
      className: "bg-blue-50 text-blue-600",
    },
    {
      label: "Ready",
      value: data.ready,
      icon: CheckCircle2,
      className: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Delayed",
      value: data.delayed,
      icon: AlertTriangle,
      className: "bg-red-50 text-red-600",
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
          <ChefHat className="h-5 w-5 text-[#FF6B35]" />
        </div>

        <div>
          <h2 className="font-semibold text-gray-900">
            Kitchen Snapshot
          </h2>

          <p className="text-sm text-gray-500">
            Live kitchen workload.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-xl border border-gray-100 p-4"
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.className}`}
              >
                <Icon className="h-4 w-4" />
              </div>

              <p className="mt-3 text-xs text-gray-500">
                {item.label}
              </p>

              <p className="mt-1 text-xl font-bold text-gray-900">
                {item.value}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default KitchenSnapshot;