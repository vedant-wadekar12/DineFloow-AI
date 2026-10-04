import {
  Ban,
  CircleCheck,
  Users,
  UserX,
} from "lucide-react";

import type {
  Customer,
  CustomerStatsData,
} from "@/types/customer.types";

interface CustomerStatsProps {
  customers: Customer[];
}

function CustomerStats({
  customers,
}: CustomerStatsProps) {
  const stats: CustomerStatsData = {
    totalCustomers: customers.length,

    activeCustomers: customers.filter(
      (customer) =>
        customer.status === "ACTIVE",
    ).length,

    inactiveCustomers: customers.filter(
      (customer) =>
        customer.status === "INACTIVE",
    ).length,

    blockedCustomers: customers.filter(
      (customer) =>
        customer.status === "BLOCKED",
    ).length,

    totalOrders: customers.reduce(
      (total, customer) =>
        total + customer.totalOrders,
      0,
    ),

    totalRevenue: customers.reduce(
      (total, customer) =>
        total + customer.totalSpent,
      0,
    ),
  };

  const cards = [
    {
      label: "Total Customers",
      value: stats.totalCustomers,
      icon: Users,
      iconClass:
        "bg-orange-50 text-[#FF6B35]",
    },
    {
      label: "Active",
      value: stats.activeCustomers,
      icon: CircleCheck,
      iconClass:
        "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Inactive",
      value: stats.inactiveCustomers,
      icon: UserX,
      iconClass:
        "bg-gray-100 text-gray-600",
    },
    {
      label: "Blocked",
      value: stats.blockedCustomers,
      icon: Ban,
      iconClass:
        "bg-red-50 text-red-600",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.label}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {card.label}
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {card.value}
                </p>
              </div>

              <div
                className={[
                  "flex h-11 w-11 items-center justify-center",
                  "rounded-xl",
                  card.iconClass,
                ].join(" ")}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CustomerStats;