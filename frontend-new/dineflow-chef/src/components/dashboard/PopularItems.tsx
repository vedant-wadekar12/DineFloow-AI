import {
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";

import type { PopularItem } from "@/types/dashboard.types";

interface PopularItemsProps {
  items: PopularItem[];
}

function PopularItems({
  items,
}: PopularItemsProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-900">
            Popular Items
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Best performing menu items.
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50">
          <TrendingUp className="h-4 w-4 text-[#FF6B35]" />
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {items.map((item, index) => (
          <div
            key={item.name}
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-sm font-bold text-gray-500">
              {index + 1}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-800">
                {item.name}
              </p>

              <p className="text-xs text-gray-400">
                {item.category} · {item.orders} orders
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">
                ₹{item.revenue.toLocaleString("en-IN")}
              </p>

              <ArrowUpRight className="ml-auto mt-1 h-3 w-3 text-emerald-500" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PopularItems;