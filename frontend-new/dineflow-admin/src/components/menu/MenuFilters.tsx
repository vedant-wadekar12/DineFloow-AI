import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

import type { MenuCategory } from "@/types/menu.types";

interface MenuFiltersProps {
  search: string;
  categoryId: string;
  availability: string;
  type: string;

  categories: MenuCategory[];

  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onAvailabilityChange: (value: string) => void;
  onTypeChange: (value: string) => void;
}

export default function MenuFilters({
  search,
  categoryId,
  availability,
  type,
  categories,
  onSearchChange,
  onCategoryChange,
  onAvailabilityChange,
  onTypeChange,
}: MenuFiltersProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
      {/* Search */}

      <div className="relative lg:col-span-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
          placeholder="Search menu items..."
          className="pl-9"
        />
      </div>

      {/* Category */}

      <select
        value={categoryId}
        onChange={(event) =>
          onCategoryChange(event.target.value)
        }
        className="rounded-md border bg-background px-3 py-2 text-sm"
      >
        <option value="">
          All Categories
        </option>

        {categories.map((category) => (
          <option
            key={category.id}
            value={category.id}
          >
            {category.name}
          </option>
        ))}
      </select>

      {/* Availability */}

      <select
        value={availability}
        onChange={(event) =>
          onAvailabilityChange(event.target.value)
        }
        className="rounded-md border bg-background px-3 py-2 text-sm"
      >
        <option value="">
          All Availability
        </option>

        <option value="available">
          Available
        </option>

        <option value="unavailable">
          Unavailable
        </option>
      </select>

      {/* Type */}

      <select
        value={type}
        onChange={(event) =>
          onTypeChange(event.target.value)
        }
        className="rounded-md border bg-background px-3 py-2 text-sm"
      >
        <option value="">
          All Types
        </option>

        <option value="vegetarian">
          Vegetarian
        </option>

        <option value="non-vegetarian">
          Non-Vegetarian
        </option>
      </select>
    </div>
  );
}