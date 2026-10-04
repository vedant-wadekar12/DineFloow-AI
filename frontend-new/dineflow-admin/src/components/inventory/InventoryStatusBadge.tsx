import type {
  InventoryItem,
} from "@/types/inventory.types";

interface InventoryStatusBadgeProps {
  item: InventoryItem;
}

export default function InventoryStatusBadge({
  item,
}: InventoryStatusBadgeProps) {
  if (item.currentStock <= 0) {
    return (
      <span className="inline-flex rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
        Out of Stock
      </span>
    );
  }

  if (
    item.currentStock <= item.minimumStock
  ) {
    return (
      <span className="inline-flex rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-700">
        Low Stock
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
      In Stock
    </span>
  );
}