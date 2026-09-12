import {
  Pencil,
  Star,
  Trash2,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import type {
  MenuCategory,
  MenuItem,
} from "@/types/menu.types";

import MenuItemStatusBadge from "./MenuItemStatusBadge";

interface MenuItemCardProps {
  item: MenuItem;
  categories: MenuCategory[];

  onEdit: (item: MenuItem) => void;
  onDelete: (item: MenuItem) => void;
}

export default function MenuItemCard({
  item,
  categories,
  onEdit,
  onDelete,
}: MenuItemCardProps) {
  const category = categories.find(
    (currentCategory) =>
      currentCategory.id === item.categoryId,
  );

  return (
    <Card className="overflow-hidden">
      {item.image ? (
        <img
          src={item.image}
          alt={item.name}
          className="h-48 w-full object-cover"
        />
      ) : (
        <div className="flex h-48 w-full items-center justify-center bg-muted text-sm text-muted-foreground">
          No image
        </div>
      )}

      <CardContent className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold">
              {item.name}
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              {category?.name ?? "Unknown category"}
            </p>
          </div>

          {item.isSpecial && (
            <Star className="h-5 w-5 shrink-0 fill-current text-[#FFB703]" />
          )}
        </div>

        {item.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {item.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">
            ₹{item.price.toFixed(2)}
          </span>

          <span
            className={
              item.isVegetarian
                ? "rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700"
                : "rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700"
            }
          >
            {item.isVegetarian
              ? "Veg"
              : "Non-Veg"}
          </span>
        </div>

        <MenuItemStatusBadge
          isAvailable={item.isAvailable}
          isActive={item.isActive}
        />

        {item.preparationTime !== undefined && (
          <p className="text-sm text-muted-foreground">
            Preparation: {item.preparationTime} min
          </p>
        )}

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => onEdit(item)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>

          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={() => onDelete(item)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}