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

interface OrderTableProps {
  orders: Order[];

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

export default function OrderTable({
  orders,
  onView,
  onEdit,
  onStatus,
  onCancel,
}: OrderTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full min-w-[1100px] text-sm">
        <thead className="border-b bg-muted/40">
          <tr>
            <th className="px-4 py-3 text-left font-medium">
              Order
            </th>

            <th className="px-4 py-3 text-left font-medium">
              Customer
            </th>

            <th className="px-4 py-3 text-left font-medium">
              Table
            </th>

            <th className="px-4 py-3 text-left font-medium">
              Type
            </th>

            <th className="px-4 py-3 text-left font-medium">
              Total
            </th>

            <th className="px-4 py-3 text-left font-medium">
              Status
            </th>

            <th className="px-4 py-3 text-left font-medium">
              Payment
            </th>

            <th className="px-4 py-3 text-right font-medium">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              className="border-b last:border-0"
            >
              <td className="px-4 py-4">
                <div>
                  <p className="font-semibold">
                    #{order.orderNumber}
                  </p>

                  {order.createdAt && (
                    <p className="text-xs text-muted-foreground">
                      {new Date(
                        order.createdAt,
                      ).toLocaleString()}
                    </p>
                  )}
                </div>
              </td>

              <td className="px-4 py-4">
                <div>
                  <p className="font-medium">
                    {order.customerName ||
                      "Guest"}
                  </p>

                  {order.customerPhone && (
                    <p className="text-xs text-muted-foreground">
                      {order.customerPhone}
                    </p>
                  )}
                </div>
              </td>

              <td className="px-4 py-4">
                {order.tableNumber
                  ? `Table ${order.tableNumber}`
                  : "—"}
              </td>

              <td className="px-4 py-4 capitalize">
                {order.orderType.replace(
                  "-",
                  " ",
                )}
              </td>

              <td className="px-4 py-4 font-semibold">
                ₹{order.total.toFixed(2)}
              </td>

              <td className="px-4 py-4">
                <OrderStatusBadge
                  status={
                    order.status
                  }
                />
              </td>

              <td className="px-4 py-4">
                <PaymentStatusBadge
                  status={
                    order.paymentStatus
                  }
                />
              </td>

              <td className="px-4 py-4">
                <div className="flex justify-end gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    title="View"
                    onClick={() =>
                      onView(order)
                    }
                  >
                    <Eye className="h-4 w-4" />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    title="Edit"
                    onClick={() =>
                      onEdit(order)
                    }
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    title="Update Status"
                    onClick={() =>
                      onStatus(order)
                    }
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>

                  {order.status !==
                    "completed" &&
                    order.status !==
                      "cancelled" && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        title="Cancel"
                        onClick={() =>
                          onCancel(
                            order,
                          )
                        }
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}