import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type {
  InventoryItem,
} from "@/types/inventory.types";

import InventoryStatusBadge from "./InventoryStatusBadge";

interface InventoryDetailsDialogProps {
  open: boolean;
  item: InventoryItem | null;

  onOpenChange: (open: boolean) => void;
}

export default function InventoryDetailsDialog({
  open,
  item,
  onOpenChange,
}: InventoryDetailsDialogProps) {
  if (!item) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Inventory Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">
              Item
            </p>

            <p className="font-semibold">
              {item.name}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Category
            </p>

            <p>
              {item.category || "—"}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              SKU
            </p>

            <p>{item.sku || "—"}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Current Stock
              </p>

              <p>
                {item.currentStock}{" "}
                {item.unit}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Minimum Stock
              </p>

              <p>
                {item.minimumStock}{" "}
                {item.unit}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Cost Per Unit
            </p>

            <p>
              ₹
              {item.costPerUnit.toFixed(
                2,
              )}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Supplier
            </p>

            <p>
              {item.supplierName ||
                "—"}
            </p>
          </div>

          <div>
            <p className="mb-1 text-sm text-muted-foreground">
              Status
            </p>

            <InventoryStatusBadge
              item={item}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}