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
  Order,
} from "@/types/order.types";

interface CancelOrderDialogProps {
  open: boolean;
  order: Order | null;
  loading?: boolean;

  onOpenChange: (
    open: boolean,
  ) => void;

  onConfirm: () => Promise<void>;
}

export default function CancelOrderDialog({
  open,
  order,
  loading = false,
  onOpenChange,
  onConfirm,
}: CancelOrderDialogProps) {
  if (!order) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Cancel Order
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-3">
          <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-red-500" />

          <div>
            <p className="text-sm">
              Are you sure you want to
              cancel order{" "}
              <strong>
                #{order.orderNumber}
              </strong>
              ?
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              This action may not be
              reversible.
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
            Keep Order
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
              ? "Cancelling..."
              : "Cancel Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}