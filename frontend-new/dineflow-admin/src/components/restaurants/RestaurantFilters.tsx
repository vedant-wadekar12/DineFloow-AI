import {
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import type { RestaurantStatus } from "@/types/restaurant.types";

interface RestaurantFiltersProps {
  search: string;
  status: RestaurantStatus | "ALL";
  onSearchChange: (value: string) => void;
  onStatusChange: (
    value: RestaurantStatus | "ALL",
  ) => void;
  onClear: () => void;
}

function RestaurantFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onClear,
}: RestaurantFiltersProps) {
  const hasFilters =
    search.length > 0 || status !== "ALL";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="Search restaurants..."
            className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#FF6B35] focus:bg-white focus:ring-2 focus:ring-orange-100"
          />
        </div>

        {/* Status */}
        <div className="relative lg:w-48">
          <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

          <select
            value={status}
            onChange={(event) =>
              onStatusChange(
                event.target.value as
                  | RestaurantStatus
                  | "ALL",
              )
            }
            className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-700 outline-none transition focus:border-[#FF6B35] focus:bg-white focus:ring-2 focus:ring-orange-100"
          >
            <option value="ALL">
              All statuses
            </option>

            <option value="ACTIVE">
              Active
            </option>

            <option value="INACTIVE">
              Inactive
            </option>

            <option value="SUSPENDED">
              Suspended
            </option>
          </select>
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
          >
            <X className="h-4 w-4" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

export default RestaurantFilters;