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
  InventoryType,
  InventoryUnit,
} from "@/types/inventory.types";

const inventorySchema = z.object({
  name: z
    .string()
    .min(2, "Item name is required"),

  description: z
    .string()
    .optional(),

  sku: z
    .string()
    .optional(),

  type: z.enum([
    "RAW_MATERIAL",
    "PACKAGING",
    "BEVERAGE",
    "OTHER",
  ]),

  unit: z.enum([
    "KG",
    "G",
    "L",
    "ML",
    "PCS",
    "PACK",
    "BOX",
    "BOTTLE",
  ]),

  currentStock: z.coerce
    .number()
    .min(0, "Stock cannot be negative"),

  minimumStock: z.coerce
    .number()
    .min(
      0,
      "Minimum stock cannot be negative",
    ),

  maximumStock: z.coerce
    .number()
    .min(
      0,
      "Maximum stock cannot be negative",
    )
    .optional(),

  costPrice: z.coerce
    .number()
    .min(
      0,
      "Cost cannot be negative",
    )
    .optional(),

  isActive: z.boolean(),
});

type InventoryFormInput =
  z.input<typeof inventorySchema>;

type InventoryFormValues =
  z.output<typeof inventorySchema>;

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
      inventorySchema,
    ),

    defaultValues: {
      name: "",
      description: "",
      sku: "",
      type: "RAW_MATERIAL",
      unit: "PCS",
      currentStock: 0,
      minimumStock: 0,
      maximumStock: undefined,
      costPrice: 0,
      isActive: true,
    },
  });

  useEffect(() => {
    if (item) {
      form.reset({
        name: item.name,
        description:
          item.description ?? "",
        sku: item.sku ?? "",
        type: item.type,
        unit: item.unit,
        currentStock:
          item.currentStock,
        minimumStock:
          item.minimumStock,
        maximumStock:
          item.maximumStock,
        costPrice:
          item.costPrice ?? 0,
        isActive: item.isActive,
      });
    } else {
      form.reset({
        name: "",
        description: "",
        sku: "",
        type: "RAW_MATERIAL",
        unit: "PCS",
        currentStock: 0,
        minimumStock: 0,
        maximumStock: undefined,
        costPrice: 0,
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
              <Label htmlFor="inventory-type">
                Inventory Type
              </Label>

              <select
                id="inventory-type"
                {...form.register("type")}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              >
                {(
                  [
                    "RAW_MATERIAL",
                    "PACKAGING",
                    "BEVERAGE",
                    "OTHER",
                  ] as InventoryType[]
                ).map((type) => (
                  <option
                    key={type}
                    value={type}
                  >
                    {type.replace(
                      "_",
                      " ",
                    )}
                  </option>
                ))}
              </select>
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
                {(
                  [
                    "KG",
                    "G",
                    "L",
                    "ML",
                    "PCS",
                    "PACK",
                    "BOX",
                    "BOTTLE",
                  ] as InventoryUnit[]
                ).map((unit) => (
                  <option
                    key={unit}
                    value={unit}
                  >
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
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
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="inventory-maximum">
                Maximum Stock
              </Label>

              <Input
                id="inventory-maximum"
                type="number"
                min="0"
                step="0.01"
                {...form.register(
                  "maximumStock",
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inventory-cost">
                Cost Price
              </Label>

              <Input
                id="inventory-cost"
                type="number"
                min="0"
                step="0.01"
                {...form.register(
                  "costPrice",
                )}
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