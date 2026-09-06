import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  ShoppingCart,
  Users,
  Wallet,
} from "lucide-react";

import type { DashboardStat } from "@/types/dashboard.types";

interface DashboardStatsProps {
  stats: DashboardStat[];
}

const icons = [
  DollarSign,
  ShoppingCart,
  Users,
  Wallet,
];

function DashboardStats({
  stats,
}: DashboardStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = icons[index];

        const isUp = stat.trend === "up";

        return (
          <div
            key={stat.title}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50">
                <Icon className="h-5 w-5 text-[#FF6B35]" />
              </div>

              <div
                className={[
                  "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold",
                  isUp
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-red-50 text-red-500",
                ].join(" ")}
              >
                {isUp ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}

                {stat.change}
              </div>
            </div>

            <p className="mt-5 text-sm text-gray-500">
              {stat.title}
            </p>

            <p className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
              {stat.value}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              {stat.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default DashboardStats;