import {
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Button,
} from "@/components/ui/button";

import type { MenuCategory } from "@/types/menu.types";

interface CategoryListProps {
  categories: MenuCategory[];
  onCreate: () => void;
  onEdit: (category: MenuCategory) => void;
  onDelete: (category: MenuCategory) => void;
}

export default function CategoryList({
  categories,
  onCreate,
  onEdit,
  onDelete,
}: CategoryListProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Categories</CardTitle>

        <Button
          type="button"
          onClick={onCreate}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </CardHeader>

      <CardContent>
        {categories.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground">
            No categories found.
          </div>
        ) : (
          <div className="space-y-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div>
                  <p className="font-medium">
                    {category.name}
                  </p>

                  {category.description && (
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  )}

                  <span
                    className={
                      category.isActive
                        ? "text-sm text-green-600"
                        : "text-sm text-gray-500"
                    }
                  >
                    {category.isActive
                      ? "Active"
                      : "Inactive"}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() =>
                      onEdit(category)
                    }
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    onClick={() =>
                      onDelete(category)
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}