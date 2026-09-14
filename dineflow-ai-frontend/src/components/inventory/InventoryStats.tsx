import {
  AlertTriangle,
  Boxes,
  PackageX,
  IndianRupee,
} from "lucide-react";

import type {
  InventoryItem,
} from "@/types/inventory.types";

interface InventoryStatsProps {
  items: InventoryItem[];
}

export default function InventoryStats({
  items,
}: InventoryStatsProps) {
  const totalItems = items.length;

  const activeItems = items.filter(
    (item) => item.isActive,
  ).length;

  const lowStockItems = items.filter(
    (item) =>
      item.currentStock > 0 &&
      item.currentStock <= item.minimumStock,
  ).length;

  const outOfStockItems = items.filter(
    (item) => item.currentStock <= 0,
  ).length;

  const totalValue = items.reduce(
    (total, item) =>
      total +
      item.currentStock * item.costPerUnit,
    0,
  );

  const stats = [
    {
      title: "Total Items",
      value: totalItems,
      icon: Boxes,
    },
    {
      title: "Active Items",
      value: activeItems,
      icon: Boxes,
    },
    {
      title: "Low Stock",
      value: lowStockItems,
      icon: AlertTriangle,
    },
    {
      title: "Out of Stock",
      value: outOfStockItems,
      icon: PackageX,
    },
    {
      title: "Inventory Value",
      value: `₹${totalValue.toFixed(2)}`,
      icon: IndianRupee,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="rounded-xl border bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {stat.title}
                </p>

                <p className="mt-2 text-2xl font-semibold">
                  {stat.value}
                </p>
              </div>

              <div className="rounded-lg bg-[#FFF1EB] p-3">
                <Icon className="h-5 w-5 text-[#FF6B35]" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}