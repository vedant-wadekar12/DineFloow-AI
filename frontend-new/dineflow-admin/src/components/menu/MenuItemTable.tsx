import {
  Pencil,
  Trash2,
} from "lucide-react";

import {
  Button,
} from "@/components/ui/button";

import MenuItemStatusBadge from "./MenuItemStatusBadge";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import type {
  MenuCategory,
  MenuItem,
} from "@/types/menu.types";

interface MenuItemTableProps {
  items: MenuItem[];
  categories: MenuCategory[];
  onEdit: (item: MenuItem) => void;
  onDelete: (item: MenuItem) => void;
}

export default function MenuItemTable({
  items,
  categories,
  onEdit,
  onDelete,
}: MenuItemTableProps) {
  const getCategoryName = (
    categoryId: string,
  ) => {
    return (
      categories.find(
        (category) =>
          category.id === categoryId,
      )?.name ?? "Unknown"
    );
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="p-4">Item</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Type</th>
                <th className="p-4">Availability</th>
                <th className="p-4">Special</th>
                <th className="p-4 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-10 w-10 rounded-md object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-muted" />
                      )}

                      <span className="font-medium">
                        {item.name}
                      </span>
                    </div>
                  </td>

                  <td className="p-4">
                    {getCategoryName(
                      item.categoryId,
                    )}
                  </td>

                  <td className="p-4">
                    ₹{item.price.toFixed(2)}
                  </td>

                  <td className="p-4">
                    {item.isVegetarian
                      ? "Veg"
                      : "Non-Veg"}
                  </td>

                  <td className="p-4">
                    <MenuItemStatusBadge
  isAvailable={item.isAvailable}
  isActive={item.isActive}
/>
                  </td>

                  <td className="p-4">
                    {item.isSpecial
                      ? "⭐ Special"
                      : "—"}
                  </td>

                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        onClick={() =>
                          onEdit(item)
                        }
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        onClick={() =>
                          onDelete(item)
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="p-10 text-center text-muted-foreground"
                  >
                    No menu items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}