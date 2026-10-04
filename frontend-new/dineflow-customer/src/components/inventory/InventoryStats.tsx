import {
  AlertTriangle,
  Boxes,
  CircleDollarSign,
  PackageCheck,
} from "lucide-react";

import type { InventoryItem } from "@/types/inventory.types";

interface InventoryStatsProps {
  items: InventoryItem[];
}

function InventoryStats({
  items,
}: InventoryStatsProps) {
  const activeItems = items.filter(
    (item) => item.isActive,
  );

  const lowStockItems = items.filter(
    (item) =>
      item.currentStock > 0 &&
      item.currentStock <= item.minimumStock,
  );

  

  const inventoryValue = items.reduce(
    (total, item) =>
      total +
      item.currentStock *
        (item.costPrice ?? 0),
    0,
  );

  const stats = [
    {
      label: "Total Items",
      value: items.length,
      icon: Boxes,
    },
    {
      label: "Active Items",
      value: activeItems.length,
      icon: PackageCheck,
    },
    {
      label: "Low Stock",
      value: lowStockItems.length,
      icon: AlertTriangle,
    },
    {
      label: "Inventory Value",
      value: `₹${inventoryValue.toLocaleString("en-IN")}`,
      icon: CircleDollarSign,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-2xl border bg-white p-5 shadow-sm"
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

              <div className="rounded-xl bg-orange-50 p-3">
                <Icon className="h-5 w-5 text-[#FF6B35]" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default InventoryStats;