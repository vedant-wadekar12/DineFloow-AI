import {
  Eye,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import type {
  InventoryItem,
} from "@/types/inventory.types";

import InventoryStatusBadge from "./InventoryStatusBadge";
import LowStockBadge from "./LowStockBadge";

interface InventoryTableProps {
  items: InventoryItem[];

  onView: (item: InventoryItem) => void;
  onEdit: (item: InventoryItem) => void;
  onAdjustStock: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
}

export default function InventoryTable({
  items,
  onView,
  onEdit,
  onAdjustStock,
  onDelete,
}: InventoryTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full min-w-[900px] text-sm">
        <thead className="border-b bg-muted/40">
          <tr>
            <th className="px-4 py-3 text-left font-medium">
              Item
            </th>

            <th className="px-4 py-3 text-left font-medium">
              Category
            </th>

            <th className="px-4 py-3 text-left font-medium">
              Stock
            </th>

            <th className="px-4 py-3 text-left font-medium">
              Minimum
            </th>

            <th className="px-4 py-3 text-left font-medium">
              Cost / Unit
            </th>

            <th className="px-4 py-3 text-left font-medium">
              Status
            </th>

            <th className="px-4 py-3 text-right font-medium">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className="border-b last:border-0"
            >
              <td className="px-4 py-4">
                <div>
                  <p className="font-medium">
                    {item.name}
                  </p>

                  {item.sku && (
                    <p className="text-xs text-muted-foreground">
                      SKU: {item.sku}
                    </p>
                  )}
                </div>
              </td>

              <td className="px-4 py-4">
                {item.category || "—"}
              </td>

              <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {item.currentStock}{" "}
                    {item.unit}
                  </span>

                  <LowStockBadge item={item} />
                </div>
              </td>

              <td className="px-4 py-4">
                {item.minimumStock}{" "}
                {item.unit}
              </td>

              <td className="px-4 py-4">
                ₹{item.costPerUnit.toFixed(2)}
              </td>

              <td className="px-4 py-4">
                <InventoryStatusBadge
                  item={item}
                />
              </td>

              <td className="px-4 py-4">
                <div className="flex justify-end gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    title="View"
                    onClick={() => onView(item)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    title="Add / Remove Stock"
                    onClick={() =>
                      onAdjustStock(item)
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    title="Edit"
                    onClick={() => onEdit(item)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    title="Delete"
                    onClick={() => onDelete(item)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}