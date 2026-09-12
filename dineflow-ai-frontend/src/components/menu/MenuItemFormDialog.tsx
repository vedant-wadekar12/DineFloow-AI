import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import type {
  MenuCategory,
  MenuItem,
} from "@/types/menu.types";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const menuItemSchema = z.object({
  categoryId: z.string().min(1, "Select a category"),

  name: z
    .string()
    .trim()
    .min(2, "Item name must be at least 2 characters"),

  description: z.string().optional(),

  price: z.coerce
    .number()
    .positive("Price must be greater than 0"),

  image: z.string().optional(),

  preparationTime: z.coerce
    .number()
    .min(0)
    .optional(),

  isVegetarian: z.boolean(),

  isAvailable: z.boolean(),

  isSpecial: z.boolean(),

  isActive: z.boolean(),

  displayOrder: z.coerce
    .number()
    .min(0)
    .optional(),
});

type MenuItemFormInput = z.input<typeof menuItemSchema>;
type MenuItemFormData = z.output<typeof menuItemSchema>;

interface MenuItemFormDialogProps {
  open: boolean;
  item?: MenuItem | null;
  categories: MenuCategory[];
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: MenuItemFormData) => Promise<void>;
}

export default function MenuItemFormDialog({
  open,
  item,
  categories,
  loading = false,
  onOpenChange,
  onSubmit,
}: MenuItemFormDialogProps) {
  const form = useForm<
  MenuItemFormInput,
  unknown,
  MenuItemFormData
>({
  resolver: zodResolver(menuItemSchema),
    defaultValues: {
      categoryId: "",
      name: "",
      description: "",
      price: 0,
      image: "",
      preparationTime: 0,
      isVegetarian: true,
      isAvailable: true,
      isSpecial: false,
      isActive: true,
      displayOrder: 0,
    },
  });

  useEffect(() => {
    if (item) {
      form.reset({
        categoryId: item.categoryId,
        name: item.name,
        description: item.description ?? "",
        price: item.price,
        image: item.image ?? "",
        preparationTime: item.preparationTime ?? 0,
        isVegetarian: item.isVegetarian,
        isAvailable: item.isAvailable,
        isSpecial: item.isSpecial,
        isActive: item.isActive,
        displayOrder: item.displayOrder ?? 0,
      });
    } else {
      form.reset({
        categoryId: "",
        name: "",
        description: "",
        price: 0,
        image: "",
        preparationTime: 0,
        isVegetarian: true,
        isAvailable: true,
        isSpecial: false,
        isActive: true,
        displayOrder: 0,
      });
    }
  }, [item, open]);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {item
              ? "Edit Menu Item"
              : "Add Menu Item"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div>
            <label className="mb-1 block text-sm font-medium">
              Category
            </label>

            <select
              {...form.register("categoryId")}
              className="w-full rounded-md border bg-background px-3 py-2"
            >
              <option value="">
                Select category
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
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Item Name
            </label>

            <Input
              {...form.register("name")}
              placeholder="e.g. Paneer Tikka"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Description
            </label>

            <Input
              {...form.register("description")}
              placeholder="Item description"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Price
            </label>

            <Input
              type="number"
              step="0.01"
              {...form.register("price")}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Preparation Time (minutes)
            </label>

            <Input
              type="number"
              {...form.register("preparationTime")}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Image URL
            </label>

            <Input
              {...form.register("image")}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...form.register("isVegetarian")}
              />
              Vegetarian
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...form.register("isAvailable")}
              />
              Available
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...form.register("isSpecial")}
              />
              Special Dish
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...form.register("isActive")}
              />
              Active
            </label>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                onOpenChange(false)
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : item
                  ? "Update Item"
                  : "Create Item"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}