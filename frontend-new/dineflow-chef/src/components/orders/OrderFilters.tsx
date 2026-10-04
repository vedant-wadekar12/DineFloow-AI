import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

interface OrderFiltersProps {
  search: string;
  status: string;
  orderType: string;

  onSearchChange: (
    value: string,
  ) => void;

  onStatusChange: (
    value: string,
  ) => void;

  onOrderTypeChange: (
    value: string,
  ) => void;
}

export default function OrderFilters({
  search,
  status,
  orderType,
  onSearchChange,
  onStatusChange,
  onOrderTypeChange,
}: OrderFiltersProps) {
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
          placeholder="Search order..."
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
        className="rounded-md border bg-background px-3 py-2 text-sm"
      >
        <option value="">
          All Statuses
        </option>

        <option value="pending">
          Pending
        </option>

        <option value="confirmed">
          Confirmed
        </option>

        <option value="preparing">
          Preparing
        </option>

        <option value="ready">
          Ready
        </option>

        <option value="served">
          Served
        </option>

        <option value="completed">
          Completed
        </option>

        <option value="cancelled">
          Cancelled
        </option>
      </select>

      <select
        value={orderType}
        onChange={(event) =>
          onOrderTypeChange(
            event.target.value,
          )
        }
        className="rounded-md border bg-background px-3 py-2 text-sm"
      >
        <option value="">
          All Order Types
        </option>

        <option value="dine-in">
          Dine In
        </option>

        <option value="takeaway">
          Takeaway
        </option>

        <option value="delivery">
          Delivery
        </option>
      </select>
    </div>
  );
}