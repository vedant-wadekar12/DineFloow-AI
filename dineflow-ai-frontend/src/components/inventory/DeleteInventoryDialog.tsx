import { AlertTriangle } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import type {
  InventoryItem,
} from "@/types/inventory.types";

interface DeleteInventoryDialogProps {
  open: boolean;
  item: InventoryItem | null;
  loading?: boolean;

  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}

export default function DeleteInventoryDialog({
  open,
  item,
  loading = false,
  onOpenChange,
  onConfirm,
}: DeleteInventoryDialogProps) {
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
            Delete Inventory Item
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-3">
          <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-red-500" />

          <div>
            <p className="text-sm">
              Are you sure you want to
              delete{" "}
              <strong>
                {item.name}
              </strong>
              ?
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              This action cannot be
              undone.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={() =>
              onOpenChange(false)
            }
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            disabled={loading}
            onClick={() =>
              void onConfirm()
            }
          >
            {loading
              ? "Deleting..."
              : "Delete Item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}