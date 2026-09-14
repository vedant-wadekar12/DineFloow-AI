import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

interface InventoryFiltersProps {
  search: string;
  category: string;
  status: string;

  categories: string[];

  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export default function InventoryFilters({
  search,
  category,
  status,
  categories,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
}: InventoryFiltersProps) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
          placeholder="Search inventory..."
          className="pl-9"
        />
      </div>

      <select
        value={category}
        onChange={(event) =>
          onCategoryChange(event.target.value)
        }
        className="rounded-md border bg-background px-3 py-2 text-sm"
      >
        <option value="">
          All Categories
        </option>

        {categories.map((item) => (
          <option
            key={item}
            value={item}
          >
            {item}
          </option>
        ))}
      </select>

      <select
        value={status}
        onChange={(event) =>
          onStatusChange(event.target.value)
        }
        className="rounded-md border bg-background px-3 py-2 text-sm"
      >
        <option value="">
          All Status
        </option>

        <option value="in-stock">
          In Stock
        </option>

        <option value="low-stock">
          Low Stock
        </option>

        <option value="out-of-stock">
          Out of Stock
        </option>
      </select>
    </div>
  );
}