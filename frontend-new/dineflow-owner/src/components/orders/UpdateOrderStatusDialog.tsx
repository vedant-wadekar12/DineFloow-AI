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
import { Label } from "@/components/ui/label";

import type {
  Order,
  OrderStatus,
} from "@/types/order.types";

const statusSchema = z.object({
  status: z.enum([
    "pending",
    "confirmed",
    "preparing",
    "ready",
    "served",
    "completed",
    "cancelled",
  ]),
});

type StatusFormValues =
  z.infer<typeof statusSchema>;

interface UpdateOrderStatusDialogProps {
  open: boolean;
  order: Order | null;
  loading?: boolean;

  onOpenChange: (
    open: boolean,
  ) => void;

  onSubmit: (
    status: OrderStatus,
  ) => Promise<void>;
}

export default function UpdateOrderStatusDialog({
  open,
  order,
  loading = false,
  onOpenChange,
  onSubmit,
}: UpdateOrderStatusDialogProps) {
  const form =
    useForm<StatusFormValues>({
      resolver:
        zodResolver(
          statusSchema,
        ),
      defaultValues: {
        status: "pending",
      },
    });

  useEffect(() => {
    if (order) {
      form.reset({
        status: order.status,
      });
    }
  }, [order, open, form]);

  if (!order) {
    return null;
  }

  const submit = async (
    values: StatusFormValues,
  ) => {
    await onSubmit(
      values.status,
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Update Order Status
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(
            submit,
          )}
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label>
              Order Status
            </Label>

            <select
              {...form.register(
                "status",
              )}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            >
              <option value="pending">
                Pending
              </option>

              <option value="confirmed">
                Confirmed
              </option>

              <option value="preparing">
                Preparing
              </option>

              <option value="ready">
                Ready
              </option>

              <option value="served">
                Served
              </option>

              <option value="completed">
                Completed
              </option>

              <option value="cancelled">
                Cancelled
              </option>
            </select>
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
                : "Update Status"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}