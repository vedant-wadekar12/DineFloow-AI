import {
  Building2,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import type { Branch } from "@/types/branch.types";

interface BranchStatsProps {
  branches: Branch[];
}

export default function BranchStats({
  branches,
}: BranchStatsProps) {
  const total = branches.length;

  const active = branches.filter(
    (branch) => branch.status === "ACTIVE",
  ).length;

  const inactive = branches.filter(
    (branch) => branch.status === "INACTIVE",
  ).length;

  const stats = [
    {
      label: "Total Branches",
      value: total,
      icon: Building2,
    },
    {
      label: "Active",
      value: active,
      icon: CheckCircle2,
    },
    {
      label: "Inactive",
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
            key={stat.label}
            className="rounded-xl border bg-card p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {stat.label}
                </p>

                <p className="mt-2 text-2xl font-semibold">
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