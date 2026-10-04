import {
  CircleCheck,
  FolderOpen,
  Star,
  Utensils,
  XCircle,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import type { MenuStats as MenuStatsType } from "@/types/menu.types";

interface MenuStatsProps {
  stats: MenuStatsType;
}

export default function MenuStats({
  stats,
}: MenuStatsProps) {
  const cards = [
    {
      title: "Categories",
      value: stats.totalCategories,
      icon: FolderOpen,
    },
    {
      title: "Menu Items",
      value: stats.totalItems,
      icon: Utensils,
    },
    {
      title: "Available",
      value: stats.availableItems,
      icon: CircleCheck,
    },
    {
      title: "Unavailable",
      value: stats.unavailableItems,
      icon: XCircle,
    },
    {
      title: "Special Items",
      value: stats.specialItems,
      icon: Star,
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