import { useEffect } from "react";

import {
  useForm,
} from "react-hook-form";

import {
  z,
} from "zod";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

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
  StockTransactionType,
} from "@/types/inventory.types";

const schema = z.object({
  type: z.enum([
    "PURCHASE",
    "CONSUMPTION",
    "ADJUSTMENT",
    "WASTE",
    "RETURN",
  ]),
  quantity: z.coerce.number().positive(
    "Quantity must be greater than zero.",
  ),
  reason: z
    .string()
    .max(500)
    .optional(),
});

type FormInput = z.input<typeof schema>;
type FormValues = z.output<typeof schema>;

interface StockAdjustmentDialogProps {
  open: boolean;
  item: InventoryItem | null;
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    values: StockAdjustmentData,
  ) => Promise<void>;
}

const transactionOptions: Array<{
  value: StockTransactionType;
  label: string;
}> = [
  {
    value: "PURCHASE",
    label: "Purchase",
  },
  {
    value: "RETURN",
    label: "Return",
  },
  {
    value: "ADJUSTMENT",
    label: "Adjustment",
  },
  {
    value: "CONSUMPTION",
    label: "Consumption",
  },
  {
    value: "WASTE",
    label: "Waste",
  },
];

export default function StockAdjustmentDialog({
  open,
  item,
  loading = false,
  onOpenChange,
  onSubmit,
}: StockAdjustmentDialogProps) {
  const form = useForm<FormInput, undefined, FormValues>({
  resolver: zodResolver(schema),
    defaultValues: {
      type: "PURCHASE",
      quantity: 1,
      reason: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        type: "PURCHASE",
        quantity: 1,
        reason: "",
      });
    }
  }, [open, form]);

  if (!item) {
    return null;
  }

  const submit = async (
    values: FormValues,
  ) => {
    await onSubmit({
      inventoryItemId: item.id,
      ...values,
    });
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

        <div className="rounded-xl bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            Current Stock
          </p>

          <p className="mt-1 text-xl font-semibold">
            {item.currentStock} {item.unit}
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit(submit)}
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="stock-type">
              Transaction Type
            </Label>

            <select
              id="stock-type"
              {...form.register("type")}
              className="flex h-10 w-full rounded-md border bg-background px-3 text-sm"
            >
              {transactionOptions.map(
                (option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ),
              )}
            </select>

            {form.formState.errors.type && (
              <p className="text-sm text-red-600">
                {form.formState.errors.type.message}
              </p>
            )}
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
              {...form.register("quantity")}
            />

            {form.formState.errors.quantity && (
              <p className="text-sm text-red-600">
                {form.formState.errors.quantity.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock-reason">
              Reason
            </Label>

            <Input
              id="stock-reason"
              {...form.register("reason")}
              placeholder="Optional reason"
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