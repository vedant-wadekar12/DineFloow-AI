import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type {
  Order,
} from "@/types/order.types";

import OrderStatusBadge from "./OrderStatusBadge";
import PaymentStatusBadge from "./PaymentStatusBadge";

interface OrderDetailsDialogProps {
  open: boolean;
  order: Order | null;

  onOpenChange: (
    open: boolean,
  ) => void;
}

export default function OrderDetailsDialog({
  open,
  order,
  onOpenChange,
}: OrderDetailsDialogProps) {
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
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Order #{order.orderNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            <OrderStatusBadge
              status={order.status}
            />

            <PaymentStatusBadge
              status={
                order.paymentStatus
              }
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">
                Customer
              </p>

              <p className="font-medium">
                {order.customerName ||
                  "Guest"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Phone
              </p>

              <p>
                {order.customerPhone ||
                  "—"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Table
              </p>

              <p>
                {order.tableNumber
                  ? `Table ${order.tableNumber}`
                  : "—"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Order Type
              </p>

              <p className="capitalize">
                {order.orderType.replace(
                  "-",
                  " ",
                )}
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-semibold">
              Items
            </h3>

            <div className="space-y-3">
              {order.items.map(
                (item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-4 border-b pb-3"
                  >
                    <div>
                      <p className="font-medium">
                        {item.menuItemName}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {item.quantity} × ₹
                        {item.price.toFixed(
                          2,
                        )}
                      </p>

                      {item.notes && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Note:{" "}
                          {item.notes}
                        </p>
                      )}
                    </div>

                    <p className="font-medium">
                      ₹
                      {item.subtotal.toFixed(
                        2,
                      )}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="space-y-2 border-t pt-4">
            <div className="flex justify-between text-sm">
              <span>
                Subtotal
              </span>

              <span>
                ₹
                {order.subtotal.toFixed(
                  2,
                )}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span>
                Tax
              </span>

              <span>
                ₹
                {order.tax.toFixed(
                  2,
                )}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span>
                Discount
              </span>

              <span>
                -₹
                {order.discount.toFixed(
                  2,
                )}
              </span>
            </div>

            <div className="flex justify-between border-t pt-3 text-lg font-semibold">
              <span>
                Total
              </span>

              <span>
                ₹
                {order.total.toFixed(
                  2,
                )}
              </span>
            </div>
          </div>

          {order.notes && (
            <div>
              <p className="text-sm text-muted-foreground">
                Order Notes
              </p>

              <p className="mt-1 text-sm">
                {order.notes}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}