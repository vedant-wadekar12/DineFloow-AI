import { useEffect } from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type {
  InventoryItem,
} from "@/types/inventory.types";

const inventorySchema = z.object({
  name: z
    .string()
    .min(2, "Item name is required"),

  description: z
    .string()
    .optional(),

  category: z
    .string()
    .optional(),

  sku: z
    .string()
    .optional(),

  unit: z.enum([
    "kg",
    "g",
    "l",
    "ml",
    "piece",
    "packet",
    "box",
    "bottle",
    "dozen",
  ]),

  currentStock: z.coerce
    .number()
    .min(0, "Stock cannot be negative"),

  minimumStock: z.coerce
    .number()
    .min(0, "Minimum stock cannot be negative"),

  costPerUnit: z.coerce
    .number()
    .min(0, "Cost cannot be negative"),

  supplierName: z
    .string()
    .optional(),

  supplierPhone: z
    .string()
    .optional(),

  isActive: z.boolean(),
});

type InventoryFormInput = z.input<typeof inventorySchema>;
type InventoryFormValues = z.output<typeof inventorySchema>;

interface InventoryFormDialogProps {
  open: boolean;
  item: InventoryItem | null;
  loading?: boolean;

  onOpenChange: (open: boolean) => void;

  onSubmit: (
    values: InventoryFormValues,
  ) => Promise<void>;
}

export default function InventoryFormDialog({
  open,
  item,
  loading = false,
  onOpenChange,
  onSubmit,
}: InventoryFormDialogProps) {
  const form = useForm<
  InventoryFormInput,
  unknown,
  InventoryFormValues
>({
  resolver: zodResolver(
    inventorySchema
  ),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      sku: "",
      unit: "piece",
      currentStock: 0,
      minimumStock: 0,
      costPerUnit: 0,
      supplierName: "",
      supplierPhone: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (item) {
      form.reset({
        name: item.name,
        description:
          item.description ?? "",
        category: item.category ?? "",
        sku: item.sku ?? "",
        unit: item.unit,
        currentStock: item.currentStock,
        minimumStock: item.minimumStock,
        costPerUnit: item.costPerUnit,
        supplierName:
          item.supplierName ?? "",
        supplierPhone:
          item.supplierPhone ?? "",
        isActive: item.isActive,
      });
    } else {
      form.reset({
        name: "",
        description: "",
        category: "",
        sku: "",
        unit: "piece",
        currentStock: 0,
        minimumStock: 0,
        costPerUnit: 0,
        supplierName: "",
        supplierPhone: "",
        isActive: true,
      });
    }
  }, [item, open, form]);

  const submit = async (
    values: InventoryFormValues,
  ) => {
    await onSubmit(values);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {item
              ? "Edit Inventory Item"
              : "Add Inventory Item"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(submit)}
          className="space-y-5"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="inventory-name">
                Item Name
              </Label>

              <Input
                id="inventory-name"
                {...form.register("name")}
                placeholder="e.g. Tomato"
              />

              {form.formState.errors.name && (
                <p className="text-sm text-red-600">
                  {
                    form.formState.errors.name
                      .message
                  }
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="inventory-sku">
                SKU
              </Label>

              <Input
                id="inventory-sku"
                {...form.register("sku")}
                placeholder="e.g. TOM-001"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="inventory-description">
              Description
            </Label>

            <Input
              id="inventory-description"
              {...form.register(
                "description",
              )}
              placeholder="Optional description"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="inventory-category">
                Category
              </Label>

              <Input
                id="inventory-category"
                {...form.register(
                  "category",
                )}
                placeholder="e.g. Vegetables"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inventory-unit">
                Unit
              </Label>

              <select
                id="inventory-unit"
                {...form.register("unit")}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              >
                {[
                  "kg",
                  "g",
                  "l",
                  "ml",
                  "piece",
                  "packet",
                  "box",
                  "bottle",
                  "dozen",
                ].map(
                  (unit) => (
                    <option
                      key={unit}
                      value={unit}
                    >
                      {unit}
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="inventory-stock">
                Current Stock
              </Label>

              <Input
                id="inventory-stock"
                type="number"
                min="0"
                step="0.01"
                disabled={Boolean(item)}
                {...form.register(
                  "currentStock",
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inventory-minimum">
                Minimum Stock
              </Label>

              <Input
                id="inventory-minimum"
                type="number"
                min="0"
                step="0.01"
                {...form.register(
                  "minimumStock",
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inventory-cost">
                Cost / Unit
              </Label>

              <Input
                id="inventory-cost"
                type="number"
                min="0"
                step="0.01"
                {...form.register(
                  "costPerUnit",
                )}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="inventory-supplier">
                Supplier
              </Label>

              <Input
                id="inventory-supplier"
                {...form.register(
                  "supplierName",
                )}
                placeholder="Supplier name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inventory-phone">
                Supplier Phone
              </Label>

              <Input
                id="inventory-phone"
                {...form.register(
                  "supplierPhone",
                )}
                placeholder="Supplier phone"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              {...form.register(
                "isActive",
              )}
            />

            Active inventory item
          </label>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={loading}
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}