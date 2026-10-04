import {
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import type { CustomerStatus } from "@/types/customer.types";

interface CustomerFiltersProps {
  search: string;
  status: CustomerStatus | "ALL";
  onSearchChange: (value: string) => void;
  onStatusChange: (
    value: CustomerStatus | "ALL",
  ) => void;
  onClear: () => void;
}

function CustomerFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onClear,
}: CustomerFiltersProps) {
  const hasFilters =
    search.trim().length > 0 ||
    status !== "ALL";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="Search by name, email or phone..."
            className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-[#FF6B35] focus:bg-white focus:ring-2 focus:ring-[#FF6B35]/10"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <select
              value={status}
              onChange={(event) =>
                onStatusChange(
                  event.target.value as
                    | CustomerStatus
                    | "ALL",
                )
              }
              className="h-11 min-w-40 appearance-none rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-8 text-sm font-medium text-gray-700 outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/10"
            >
              <option value="ALL">
                All Statuses
              </option>
              <option value="ACTIVE">
                Active
              </option>
              <option value="INACTIVE">
                Inactive
              </option>
              <option value="BLOCKED">
                Blocked
              </option>
            </select>
          </div>

          {hasFilters && (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-gray-200 px-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerFilters;