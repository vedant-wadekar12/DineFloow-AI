import { ChevronDown, Store } from "lucide-react";

function RestaurantSelector() {
  return (
    <button className="flex min-w-0 items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2 text-left transition hover:border-orange-200 hover:bg-orange-50/40">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-100">
        <Store className="h-4 w-4 text-[#FF6B35]" />
      </div>

      <div className="hidden min-w-0 md:block">
        <p className="truncate text-xs text-gray-500">
          Restaurant
        </p>

        <p className="max-w-[150px] truncate text-sm font-semibold text-gray-900">
          My Restaurant
        </p>
      </div>

      <ChevronDown className="ml-auto h-4 w-4 text-gray-400" />
    </button>
  );
}

export default RestaurantSelector;