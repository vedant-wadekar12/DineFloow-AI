import {
  CheckCircle2,
  Clock3,
  CookingPot,
  IndianRupee,
  ShoppingBag,
} from "lucide-react";

import type {
  Order,
} from "@/types/order.types";

interface OrderStatsProps {
  orders: Order[];
}

export default function OrderStats({
  orders,
}: OrderStatsProps) {
  const totalOrders =
    orders.length;

  const pendingOrders =
    orders.filter(
      (order) =>
        order.status ===
        "pending",
    ).length;

  const preparingOrders =
    orders.filter(
      (order) =>
        order.status ===
        "preparing",
    ).length;

  const completedOrders =
    orders.filter(
      (order) =>
        order.status ===
        "completed",
    ).length;

  const totalRevenue =
    orders
      .filter(
        (order) =>
          order.status !==
          "cancelled",
      )
      .reduce(
        (total, order) =>
          total + order.total,
        0,
      );

  const stats = [
    {
      title: "Total Orders",
      value: totalOrders,
      icon: ShoppingBag,
    },

    {
      title: "Pending",
      value: pendingOrders,
      icon: Clock3,
    },

    {
      title: "Preparing",
      value: preparingOrders,
      icon: CookingPot,
    },

    {
      title: "Completed",
      value: completedOrders,
      icon: CheckCircle2,
    },

    {
      title: "Revenue",
      value: `₹${totalRevenue.toFixed(2)}`,
      icon: IndianRupee,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="rounded-xl border bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {stat.title}
                </p>

                <p className="mt-2 text-2xl font-semibold">
                  {stat.value}
                </p>
              </div>

              <div className="rounded-lg bg-[#FFF1EB] p-3">
                <Icon className="h-5 w-5 text-[#FF6B35]" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}