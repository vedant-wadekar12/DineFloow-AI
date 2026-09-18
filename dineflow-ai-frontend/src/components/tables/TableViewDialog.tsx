import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import TableStatusBadge from "@/components/tables/TableStatusBadge";

import type {
  RestaurantTable,
} from "@/types/table.types";

interface TableViewDialogProps {
  open: boolean;
  table: RestaurantTable | null;
  onOpenChange: (open: boolean) => void;
}

export default function TableViewDialog({
  open,
  table,
  onOpenChange,
}: TableViewDialogProps) {
  if (!table) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            Table Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Table name */}
          <div>
            <p className="text-sm text-muted-foreground">
              Table Name
            </p>

            <p className="mt-1 text-lg font-semibold">
              {table.name}
            </p>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Table Number
              </p>

              <p className="mt-1 font-medium">
                {table.tableNumber ?? "—"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Capacity
              </p>

              <p className="mt-1 font-medium">
                {table.capacity}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Type
              </p>

              <p className="mt-1 font-medium">
                {table.type ?? "—"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Status
              </p>

              <div className="mt-1">
                <TableStatusBadge
                  status={table.status}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          {table.description && (
            <div>
              <p className="text-sm text-muted-foreground">
                Description
              </p>

              <p className="mt-1 text-sm">
                {table.description}
              </p>
            </div>
          )}

          {/* QR */}
          <div>
            <p className="text-sm text-muted-foreground">
              QR Code
            </p>

            <p className="mt-1 text-sm font-medium">
              {table.qrCode
                ? "Generated"
                : "Not generated"}
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                onOpenChange(false)
              }
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}