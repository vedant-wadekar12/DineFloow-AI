import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

import type { MenuCategory } from "@/types/menu.types";

const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters"),

  description: z
    .string()
    .trim()
    .max(500, "Description must not exceed 500 characters")
    .optional(),

  sortOrder: z
    .number()
    .int()
    .min(0, "Sort order cannot be negative")
    .optional(),
});

export type CategoryFormData = z.output<typeof categorySchema>;

interface CategoryFormDialogProps {
  open: boolean;
  category?: MenuCategory | null;
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CategoryFormData) => Promise<void>;
}

export default function CategoryFormDialog({
  open,
  category,
  loading = false,
  onOpenChange,
  onSubmit,
}: CategoryFormDialogProps) {
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      sortOrder: 0,
    },
  });

  useEffect(() => {
    if (!open) return;

    if (category) {
      form.reset({
        name: category.name,
        description: category.description ?? "",
        sortOrder: category.sortOrder ?? 0,
      });
    } else {
      form.reset({
        name: "",
        description: "",
        sortOrder: 0,
      });
    }
  }, [open, category, form]);

  const handleSubmit = async (data: CategoryFormData) => {
    await onSubmit({
      name: data.name.trim(),
      description: data.description?.trim() || undefined,
      sortOrder: data.sortOrder,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {category ? "Edit Category" : "Create Category"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="category-name">Category Name</Label>

            <Input
              id="category-name"
              placeholder="Example: Starters"
              disabled={loading}
              {...form.register("name")}
            />

            {form.formState.errors.name && (
              <p className="text-sm text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category-description">
              Description
            </Label>

            <Textarea
              id="category-description"
              placeholder="Describe this category..."
              disabled={loading}
              {...form.register("description")}
            />

            {form.formState.errors.description && (
              <p className="text-sm text-red-500">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category-sort-order">
              Sort Order
            </Label>

            <Input
              id="category-sort-order"
              type="number"
              min="0"
              step="1"
              disabled={loading}
              {...form.register("sortOrder", {
                valueAsNumber: true,
              })}
            />

            {form.formState.errors.sortOrder && (
              <p className="text-sm text-red-500">
                {form.formState.errors.sortOrder.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : category
                  ? "Update Category"
                  : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}