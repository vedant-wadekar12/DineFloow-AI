import {
  Eye,
  MoreHorizontal,
  Pencil,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import type {
  Order,
} from "@/types/order.types";

import OrderStatusBadge from "./OrderStatusBadge";
import PaymentStatusBadge from "./PaymentStatusBadge";

interface OrderCardProps {
  order: Order;

  onView: (
    order: Order,
  ) => void;

  onEdit: (
    order: Order,
  ) => void;

  onStatus: (
    order: Order,
  ) => void;

  onCancel: (
    order: Order,
  ) => void;
}

export default function OrderCard({
  order,
  onView,
  onEdit,
  onStatus,
  onCancel,
}: OrderCardProps) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold">
            #{order.orderNumber}
          </p>

          <p className="text-sm text-muted-foreground">
            {order.customerName ||
              "Guest"}
          </p>
        </div>

        <OrderStatusBadge
          status={order.status}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-muted-foreground">
            Table
          </p>

          <p className="font-medium">
            {order.tableNumber
              ? `Table ${order.tableNumber}`
              : "—"}
          </p>
        </div>

        <div>
          <p className="text-muted-foreground">
            Type
          </p>

          <p className="font-medium capitalize">
            {order.orderType.replace(
              "-",
              " ",
            )}
          </p>
        </div>

        <div>
          <p className="text-muted-foreground">
            Total
          </p>

          <p className="font-semibold">
            ₹{order.total.toFixed(2)}
          </p>
        </div>

        <div>
          <p className="text-muted-foreground">
            Payment
          </p>

          <PaymentStatusBadge
            status={
              order.paymentStatus
            }
          />
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() =>
            onView(order)
          }
        >
          <Eye className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() =>
            onStatus(order)
          }
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() =>
            onEdit(order)
          }
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>

        {order.status !==
          "completed" &&
          order.status !==
            "cancelled" && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() =>
                onCancel(order)
              }
            >
              <X className="h-4 w-4" />
            </Button>
          )}
      </div>
    </div>
  );
}