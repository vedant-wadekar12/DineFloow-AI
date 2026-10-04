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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import type { MenuCategory, MenuItem } from "@/types/menu.types";

const menuItemSchema = z
  .object({
    categoryId: z.string().min(1, "Select a category"),

    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(150, "Name must not exceed 150 characters"),

    description: z
      .string()
      .trim()
      .max(1000, "Description must not exceed 1000 characters")
      .optional(),

    type: z.enum(["FOOD", "BEVERAGE", "DESSERT", "OTHER"]),

    price: z.number().min(0, "Price cannot be negative"),

    discountPrice: z
      .number()
      .min(0, "Discount price cannot be negative")
      .optional(),

    image: z
      .string()
      .trim()
      .max(500, "Image URL must not exceed 500 characters")
      .optional(),

    isVegetarian: z.boolean(),

    isVegan: z.boolean(),

    preparationTime: z
      .number()
      .int("Preparation time must be a whole number")
      .min(0, "Preparation time cannot be negative")
      .optional(),

    sortOrder: z
      .number()
      .int("Sort order must be a whole number")
      .min(0, "Sort order cannot be negative")
      .optional(),
  })
  .refine(
    (data) =>
      data.discountPrice === undefined ||
      data.discountPrice <= data.price,
    {
      message: "Discount price cannot be greater than the original price.",
      path: ["discountPrice"],
    },
  );

type MenuItemFormInput = z.input<typeof menuItemSchema>;

export type MenuItemFormData = z.output<typeof menuItemSchema>;

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
  const form = useForm<MenuItemFormInput, unknown, MenuItemFormData>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      categoryId: "",
      name: "",
      description: "",
      type: "FOOD",
      price: 0,
      discountPrice: undefined,
      image: "",
      isVegetarian: false,
      isVegan: false,
      preparationTime: undefined,
      sortOrder: 0,
    },
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    if (item) {
      form.reset({
        categoryId: item.categoryId,
        name: item.name,
        description: item.description ?? "",
        type: item.type,
        price: item.price,
        discountPrice: item.discountPrice,
        image: item.image ?? "",
        isVegetarian: item.isVegetarian ?? false,
        isVegan: item.isVegan ?? false,
        preparationTime: item.preparationTime,
        sortOrder: item.sortOrder ?? 0,
      });
    } else {
      form.reset({
        categoryId: "",
        name: "",
        description: "",
        type: "FOOD",
        price: 0,
        discountPrice: undefined,
        image: "",
        isVegetarian: false,
        isVegan: false,
        preparationTime: undefined,
        sortOrder: 0,
      });
    }
  }, [open, item, form]);

  const handleSubmit = async (data: MenuItemFormData) => {
    await onSubmit({
      ...data,
      name: data.name.trim(),
      description: data.description?.trim() || undefined,
      image: data.image?.trim() || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>
            {item ? "Edit Menu Item" : "Create Menu Item"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-5"
        >
          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="categoryId">Category</Label>

            <Select
              value={form.watch("categoryId")}
              onValueChange={(value) => {
                if (value) {
                  form.setValue("categoryId", value, {
                    shouldValidate: true,
                  });
                }
              }}
              disabled={loading}
            >
              <SelectTrigger id="categoryId">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>

              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {form.formState.errors.categoryId && (
              <p className="text-sm text-red-500">
                {form.formState.errors.categoryId.message}
              </p>
            )}
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>

            <Input
              id="name"
              placeholder="Example: Paneer Tikka"
              disabled={loading}
              {...form.register("name")}
            />

            {form.formState.errors.name && (
              <p className="text-sm text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>

            <Textarea
              id="description"
              placeholder="Describe the menu item..."
              disabled={loading}
              {...form.register("description")}
            />

            {form.formState.errors.description && (
              <p className="text-sm text-red-500">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>

            <Select
              value={form.watch("type")}
              onValueChange={(value) => {
                if (
                  value === "FOOD" ||
                  value === "BEVERAGE" ||
                  value === "DESSERT" ||
                  value === "OTHER"
                ) {
                  form.setValue("type", value, {
                    shouldValidate: true,
                  });
                }
              }}
              disabled={loading}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="FOOD">Food</SelectItem>
                <SelectItem value="BEVERAGE">Beverage</SelectItem>
                <SelectItem value="DESSERT">Dessert</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>

              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                disabled={loading}
                {...form.register("price", {
                  valueAsNumber: true,
                })}
              />

              {form.formState.errors.price && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.price.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountPrice">
                Discount Price
              </Label>

              <Input
                id="discountPrice"
                type="number"
                min="0"
                step="0.01"
                disabled={loading}
                {...form.register("discountPrice", {
                  setValueAs: (value) =>
                    value === "" ? undefined : Number(value),
                })}
              />

              {form.formState.errors.discountPrice && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.discountPrice.message}
                </p>
              )}
            </div>
          </div>

          {/* Image */}
          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>

            <Input
              id="image"
              type="url"
              placeholder="https://example.com/image.jpg"
              disabled={loading}
              {...form.register("image")}
            />

            {form.formState.errors.image && (
              <p className="text-sm text-red-500">
                {form.formState.errors.image.message}
              </p>
            )}
          </div>

          {/* Preparation time + Sort order */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="preparationTime">
                Preparation Time (minutes)
              </Label>

              <Input
                id="preparationTime"
                type="number"
                min="0"
                step="1"
                disabled={loading}
                {...form.register("preparationTime", {
                  setValueAs: (value) =>
                    value === "" ? undefined : Number(value),
                })}
              />

              {form.formState.errors.preparationTime && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.preparationTime.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sortOrder">Sort Order</Label>

              <Input
                id="sortOrder"
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
          </div>

          {/* Vegetarian */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label htmlFor="isVegetarian">
                Vegetarian
              </Label>

              <p className="text-sm text-muted-foreground">
                Mark this item as vegetarian.
              </p>
            </div>

            <input
              id="isVegetarian"
              type="checkbox"
              className="h-4 w-4"
              checked={form.watch("isVegetarian")}
              onChange={(event) =>
                form.setValue(
                  "isVegetarian",
                  event.target.checked,
                )
              }
              disabled={loading}
            />
          </div>

          {/* Vegan */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label htmlFor="isVegan">Vegan</Label>

              <p className="text-sm text-muted-foreground">
                Mark this item as vegan.
              </p>
            </div>

            <input
              id="isVegan"
              type="checkbox"
              className="h-4 w-4"
              checked={form.watch("isVegan")}
              onChange={(event) =>
                form.setValue(
                  "isVegan",
                  event.target.checked,
                )
              }
              disabled={loading}
            />
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
                : item
                  ? "Update Item"
                  : "Create Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}