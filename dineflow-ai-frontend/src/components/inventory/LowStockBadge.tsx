import { AlertTriangle } from "lucide-react";

import type {
  InventoryItem,
} from "@/types/inventory.types";

interface LowStockBadgeProps {
  item: InventoryItem;
}

export default function LowStockBadge({
  item,
}: LowStockBadgeProps) {
  if (item.currentStock > item.minimumStock) {
    return null;
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-700">
      <AlertTriangle className="h-3.5 w-3.5" />
      Reorder
    </span>
  );
}