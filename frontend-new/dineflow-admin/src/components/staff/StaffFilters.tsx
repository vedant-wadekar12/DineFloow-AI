import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

interface StaffFiltersProps {
  search: string;
  role: string;
  status: string;

  onSearchChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export default function StaffFilters({
  search,
  role,
  status,
  onSearchChange,
  onRoleChange,
  onStatusChange,
}: StaffFiltersProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(event) =>
            onSearchChange(
              event.target.value,
            )
          }
          placeholder="Search staff..."
          className="pl-9"
        />
      </div>

      <select
        value={role}
        onChange={(event) =>
          onRoleChange(event.target.value)
        }
        className="rounded-md border bg-background px-3 py-2"
      >
        <option value="">All Roles</option>
        <option value="RESTAURANT_OWNER">
          Restaurant Owner
        </option>
        <option value="BRANCH_MANAGER">
          Branch Manager
        </option>
        <option value="CASHIER">
          Cashier
        </option>
        <option value="WAITER">
          Waiter
        </option>
        <option value="CHEF">
          Chef
        </option>
        <option value="KITCHEN_STAFF">
          Kitchen Staff
        </option>
      </select>

      <select
        value={status}
        onChange={(event) =>
          onStatusChange(event.target.value)
        }
        className="rounded-md border bg-background px-3 py-2"
      >
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">
          Inactive
        </option>
      </select>
    </div>
  );
}