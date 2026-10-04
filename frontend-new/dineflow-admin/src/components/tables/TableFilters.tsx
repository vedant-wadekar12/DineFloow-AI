import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

interface TableFiltersProps {
  search: string;
  status: string;
  type: string;

  onSearchChange: (
    value: string,
  ) => void;

  onStatusChange: (
    value: string,
  ) => void;

  onTypeChange: (
    value: string,
  ) => void;
}

export default function TableFilters({
  search,
  status,
  type,
  onSearchChange,
  onStatusChange,
  onTypeChange,
}: TableFiltersProps) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(event) =>
            onSearchChange(
              event.target.value,
            )
          }
          placeholder="Search tables..."
          className="pl-9"
        />
      </div>

      <select
        value={status}
        onChange={(event) =>
          onStatusChange(
            event.target.value,
          )
        }
        className="h-10 rounded-md border bg-background px-3 text-sm"
      >
        <option value="ALL">
          All Status
        </option>

        <option value="AVAILABLE">
          Available
        </option>

        <option value="OCCUPIED">
          Occupied
        </option>

        <option value="RESERVED">
          Reserved
        </option>

        <option value="INACTIVE">
          Inactive
        </option>
      </select>

      <select
        value={type}
        onChange={(event) =>
          onTypeChange(
            event.target.value,
          )
        }
        className="h-10 rounded-md border bg-background px-3 text-sm"
      >
        <option value="ALL">
          All Types
        </option>

        <option value="STANDARD">
          Standard
        </option>

        <option value="COUPLE">
          Couple
        </option>

        <option value="FAMILY">
          Family
        </option>

        <option value="OUTDOOR">
          Outdoor
        </option>

        <option value="VIP">
          VIP
        </option>

        <option value="BAR">
          Bar
        </option>
      </select>
    </div>
  );
}