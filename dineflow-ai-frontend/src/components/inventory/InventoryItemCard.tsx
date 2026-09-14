import {
  Eye,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

import type {
  InventoryItem,
} from "@/types/inventory.types";

import InventoryStatusBadge from "./InventoryStatusBadge";
import LowStockBadge from "./LowStockBadge";

interface InventoryItemCardProps {
  item: InventoryItem;

  onView: (item: InventoryItem) => void;
  onEdit: (item: InventoryItem) => void;
  onAdjustStock: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
}

export default function InventoryItemCard({
  item,
  onView,
  onEdit,
  onAdjustStock,
  onDelete,
}: InventoryItemCardProps) {
  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold">
              {item.name}
            </h3>

            <p className="text-sm text-muted-foreground">
              {item.category || "Uncategorized"}
            </p>
          </div>

          <InventoryStatusBadge
            item={item}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">
              Current Stock
            </p>

            <p className="font-medium">
              {item.currentStock} {item.unit}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground">
              Minimum Stock
            </p>

            <p className="font-medium">
              {item.minimumStock} {item.unit}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground">
              Cost / Unit
            </p>

            <p className="font-medium">
              ₹{item.costPerUnit.toFixed(2)}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground">
              Supplier
            </p>

            <p className="font-medium">
              {item.supplierName || "—"}
            </p>
          </div>
        </div>

        <LowStockBadge item={item} />

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => onView(item)}
          >
            <Eye className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() =>
              onAdjustStock(item)
            }
          >
            <Plus className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => onEdit(item)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>

          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={() => onDelete(item)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}