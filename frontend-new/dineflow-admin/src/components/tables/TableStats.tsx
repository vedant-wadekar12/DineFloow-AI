import {
  Armchair,
  CheckCircle2,
  Users,
} from "lucide-react";

import type {
  RestaurantTable,
} from "@/types/table.types";

interface TableStatsProps {
  tables: RestaurantTable[];
}

export default function TableStats({
  tables,
}: TableStatsProps) {
  const total = tables.length;

  const available =
    tables.filter(
      (table) =>
        table.status === "AVAILABLE",
    ).length;

  const capacity = tables.reduce(
    (total, table) =>
      total + table.capacity,
    0,
  );

  const stats = [
    {
      title: "Total Tables",
      value: total,
      icon: Armchair,
    },
    {
      title: "Available",
      value: available,
      icon: CheckCircle2,
    },
    {
      title: "Total Capacity",
      value: capacity,
      icon: Users,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="rounded-xl border bg-card p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {stat.title}
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {stat.value}
                </p>
              </div>

              <div className="rounded-lg bg-orange-100 p-3">
                <Icon className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}