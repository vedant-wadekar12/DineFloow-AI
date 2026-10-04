import {
  Filter,
  Search,
  X,
} from "lucide-react";

export type SupplierStatusFilter =
  | "all"
  | "active"
  | "inactive";

interface SupplierFiltersProps {
  search: string;
  status: SupplierStatusFilter;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: SupplierStatusFilter) => void;
  onClear: () => void;
}

function SupplierFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onClear,
}: SupplierFiltersProps) {
  const hasFilters = search.trim().length > 0 || status !== "all";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="Search by supplier, company, phone or email..."
            className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-[#FF6B35] focus:bg-white focus:ring-2 focus:ring-[#FF6B35]/10"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <select
              value={status}
              onChange={(event) =>
                onStatusChange(
                  event.target.value as SupplierStatusFilter,
                )
              }
              className="h-11 min-w-[160px] appearance-none rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-9 text-sm font-medium text-gray-700 outline-none transition focus:border-[#FF6B35] focus:bg-white focus:ring-2 focus:ring-[#FF6B35]/10"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {hasFilters && (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-gray-200 px-4 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
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

export default SupplierFilters;