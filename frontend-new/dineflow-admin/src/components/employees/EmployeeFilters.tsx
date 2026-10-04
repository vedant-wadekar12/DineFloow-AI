import { Search, X } from "lucide-react";

import type {
  EmployeeStatus,
} from "@/types/employee.types";

interface EmployeeFiltersProps {
  search: string;
  status: "ALL" | EmployeeStatus;
  onSearchChange: (value: string) => void;
  onStatusChange: (
    value: "ALL" | EmployeeStatus,
  ) => void;
  onClear: () => void;
}

function EmployeeFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onClear,
}: EmployeeFiltersProps) {
  const hasFilters =
    search.trim().length > 0 ||
    status !== "ALL";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

          <input
            value={search}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="Search employees..."
            className="h-11 w-full rounded-xl border border-gray-200 pl-10 pr-4 text-sm outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-orange-100"
          />
        </div>

        <select
          value={status}
          onChange={(event) =>
            onStatusChange(
              event.target.value as
                | "ALL"
                | EmployeeStatus,
            )
          }
          className="h-11 rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-[#FF6B35]"
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="TERMINATED">
            Terminated
          </option>
        </select>

        {hasFilters && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            <X className="h-4 w-4" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

export default EmployeeFilters;