import {
  Building2,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import type { Floor } from "@/types/floor.types";

interface FloorStatsProps {
  floors: Floor[];
}

export default function FloorStats({
  floors,
}: FloorStatsProps) {
  const total = floors.length;

  const active = floors.filter(
    (floor) => floor.status === "ACTIVE",
  ).length;

  const inactive = floors.filter(
    (floor) => floor.status === "INACTIVE",
  ).length;

  const stats = [
    {
      title: "Total Floors",
      value: total,
      icon: Building2,
    },
    {
      title: "Active",
      value: active,
      icon: CheckCircle2,
    },
    {
      title: "Inactive",
      value: inactive,
      icon: XCircle,
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