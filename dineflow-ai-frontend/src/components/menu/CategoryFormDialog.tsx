import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import type { MenuCategory } from "@/types/menu.types";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Input,
} from "@/components/ui/input";

import {
  Button,
} from "@/components/ui/button";

const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters"),

  description: z
    .string()
    .optional(),

  displayOrder: z
    .coerce
    .number()
    .min(0)
    .optional(),

  isActive: z.boolean(),
});

type CategoryFormInput = z.input<typeof categorySchema>;
type CategoryFormData = z.output<typeof categorySchema>;

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
  const form = useForm<
  CategoryFormInput,
  unknown,
  CategoryFormData
>({
  resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      displayOrder: 0,
      isActive: true,
    },
  });

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        description: category.description ?? "",
        displayOrder: category.displayOrder ?? 0,
        isActive: category.isActive,
      });
    } else {
      form.reset({
        name: "",
        description: "",
        displayOrder: 0,
        isActive: true,
      });
    }
  }, [category, open]);

  const submit = async (
    data: CategoryFormData,
  ) => {
    await onSubmit(data);
    form.reset();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {category
              ? "Edit Category"
              : "Create Category"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(submit)}
          className="space-y-4"
        >
          <div>
            <label className="mb-1 block text-sm font-medium">
              Category Name
            </label>

            <Input
              {...form.register("name")}
              placeholder="e.g. Starters"
            />

            {form.formState.errors.name && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Description
            </label>

            <Input
              {...form.register("description")}
              placeholder="Category description"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Display Order
            </label>

            <Input
              type="number"
              {...form.register("displayOrder")}
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              {...form.register("isActive")}
            />

            Active
          </label>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : category
                  ? "Update Category"
                  : "Create Category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}