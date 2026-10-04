import {
  ChefHat,
  CircleCheck,
  ShieldCheck,
  Users,
  Utensils,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import type { StaffStats as StaffStatsType } from "@/types/staff.types";

interface StaffStatsProps {
  stats: StaffStatsType;
}

export default function StaffStats({
  stats,
}: StaffStatsProps) {
  const cards = [
    {
      title: "Total Staff",
      value: stats.totalStaff,
      icon: Users,
    },
    {
      title: "Active Staff",
      value: stats.activeStaff,
      icon: CircleCheck,
    },
    {
      title: "Managers",
      value: stats.managers,
      icon: ShieldCheck,
    },
    {
      title: "Waiters",
      value: stats.waiters,
      icon: Utensils,
    },
    {
      title: "Chefs",
      value: stats.chefs,
      icon: ChefHat,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card key={card.title}>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-muted-foreground">
                  {card.title}
                </p>

                <p className="mt-1 text-2xl font-semibold">
                  {card.value}
                </p>
              </div>

              <Icon className="h-5 w-5 text-[#FF6B35]" />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}