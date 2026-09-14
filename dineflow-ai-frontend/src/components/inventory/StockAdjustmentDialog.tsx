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
  StockAdjustmentData,
} from "@/types/inventory.types";

const stockSchema = z.object({
  type: z.enum(["add", "remove"]),
  quantity: z.coerce
    .number()
    .positive(
      "Quantity must be greater than zero",
    ),
  reason: z
    .string()
    .max(
      200,
      "Reason is too long",
    )
    .optional(),
});

type StockFormInput = z.input<typeof stockSchema>;
type StockFormValues = z.output<typeof stockSchema>;

interface StockAdjustmentDialogProps {
  open: boolean;
  item: InventoryItem | null;
  loading?: boolean;

  onOpenChange: (open: boolean) => void;

  onSubmit: (
    values: StockAdjustmentData,
  ) => Promise<void>;
}

export default function StockAdjustmentDialog({
  open,
  item,
  loading = false,
  onOpenChange,
  onSubmit,
}: StockAdjustmentDialogProps) {
  const form = useForm<
  StockFormInput,
  unknown,
  StockFormValues
>({
  resolver: zodResolver(
    stockSchema
  ),
    defaultValues: {
      type: "add",
      quantity: 1,
      reason: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        type: "add",
        quantity: 1,
        reason: "",
      });
    }
  }, [open, form]);

  if (!item) {
    return null;
  }

  const submit = async (
    values: StockFormValues,
  ) => {
    await onSubmit(values);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Adjust Stock — {item.name}
          </DialogTitle>
        </DialogHeader>

        <div className="mb-4 rounded-lg bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            Current Stock
          </p>

          <p className="text-xl font-semibold">
            {item.currentStock}{" "}
            {item.unit}
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit(submit)}
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="stock-type">
              Adjustment
            </Label>

            <select
              id="stock-type"
              {...form.register("type")}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            >
              <option value="add">
                Add Stock
              </option>

              <option value="remove">
                Remove Stock
              </option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock-quantity">
              Quantity
            </Label>

            <Input
              id="stock-quantity"
              type="number"
              min="0.01"
              step="0.01"
              {...form.register(
                "quantity",
              )}
            />

            {form.formState.errors.quantity && (
              <p className="text-sm text-red-600">
                {
                  form.formState.errors
                    .quantity.message
                }
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock-reason">
              Reason
            </Label>

            <Input
              id="stock-reason"
              {...form.register(
                "reason",
              )}
              placeholder="e.g. New delivery"
            />
          </div>

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
                ? "Updating..."
                : "Update Stock"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}