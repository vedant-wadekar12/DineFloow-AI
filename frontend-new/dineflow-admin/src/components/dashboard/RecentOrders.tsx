import { ArrowUpRight } from "lucide-react";

import type { RecentOrder } from "@/types/dashboard.types";

interface RecentOrdersProps {
  orders: RecentOrder[];
}

function RecentOrders({
  orders,
}: RecentOrdersProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 p-5 sm:p-6">
        <div>
          <h2 className="font-semibold text-gray-900">
            Recent Orders
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Latest orders from your restaurant.
          </p>
        </div>

        <button className="flex items-center gap-1 text-sm font-semibold text-[#FF6B35] hover:underline">
          View all
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-100 text-left">
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400 sm:px-6">
                Order
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Customer
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Table
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Amount
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-gray-50 last:border-0 hover:bg-gray-50/70"
              >
                <td className="px-5 py-4 sm:px-6">
                  <p className="text-sm font-semibold text-gray-900">
                    {order.id}
                  </p>

                  <p className="mt-0.5 text-xs text-gray-400">
                    {order.time}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <p className="text-sm font-medium text-gray-700">
                    {order.customer}
                  </p>

                  <p className="text-xs text-gray-400">
                    {order.items} items
                  </p>
                </td>

                <td className="px-5 py-4 text-sm text-gray-600">
                  {order.table}
                </td>

                <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                  ₹{order.amount.toLocaleString("en-IN")}
                </td>

                <td className="px-5 py-4">
                  <StatusBadge status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: RecentOrder["status"];
}) {
  const styles: Record<
    RecentOrder["status"],
    string
  > = {
    Completed:
      "bg-emerald-50 text-emerald-600",
    Preparing:
      "bg-blue-50 text-blue-600",
    Pending:
      "bg-orange-50 text-orange-600",
    Cancelled:
      "bg-red-50 text-red-600",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export default RecentOrders;