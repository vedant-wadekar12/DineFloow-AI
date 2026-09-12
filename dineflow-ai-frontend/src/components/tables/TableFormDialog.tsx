import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type {
  RestaurantTable,
  CreateTableData,
  TableType,
} from "@/types/table.types";

const tableSchema = z.object({
  name: z.string().min(
    1,
    "Table name is required",
  ),

  tableNumber: z.string().optional(),

  type: z.enum([
    "STANDARD",
    "COUPLE",
    "FAMILY",
    "OUTDOOR",
    "VIP",
    "BAR",
  ]),

  capacity: z.coerce.number().min(
    1,
    "Capacity must be at least 1",
  ),

  description: z.string().optional(),
});

type FormValues =
  z.output<typeof tableSchema>;

interface TableFormDialogProps {
  open: boolean;

  table?: RestaurantTable | null;

  restaurantId: string;
  branchId: string;
  floorId: string;

  loading?: boolean;

  onOpenChange: (open: boolean) => void;

  onSubmit: (
    data: CreateTableData,
  ) => Promise<void>;
}

export default function TableFormDialog({
  open,
  table,
  restaurantId,
  branchId,
  floorId,
  loading = false,
  onOpenChange,
  onSubmit,
}: TableFormDialogProps) {
  const isEditing = Boolean(table);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<
  z.input<typeof tableSchema>,
  unknown,
  z.output<typeof tableSchema>
>({
  resolver: zodResolver(tableSchema),

    defaultValues: {
      name: "",
      tableNumber: "",
      type: "STANDARD",
      capacity: 2,
      description: "",
    },
  });

  useEffect(() => {
    if (table) {
      reset({
        name: table.name,

        tableNumber:
          table.tableNumber || "",

        type: table.type,

        capacity: table.capacity,

        description:
          table.description || "",
      });
    } else {
      reset();
    }
  }, [table, reset]);

  const submitForm = async (
    values: FormValues,
  ) => {
    const data: CreateTableData = {
      restaurantId,
      branchId,
      floorId,

      name: values.name,

      tableNumber:
        values.tableNumber ||
        undefined,

      type: values.type as TableType,

      capacity: values.capacity,

      description:
        values.description ||
        undefined,
    };

    await onSubmit(data);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? "Edit Table"
              : "Create Table"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(submitForm)}
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label>Table Name *</Label>

            <Input
              {...register("name")}
              placeholder="Table 01"
            />

            {errors.name && (
              <p className="text-sm text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Table Number</Label>

            <Input
              {...register(
                "tableNumber",
              )}
              placeholder="T01"
            />
          </div>

          <div className="space-y-2">
            <Label>Table Type</Label>

            <select
              {...register("type")}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            >
              <option value="STANDARD">
                Standard
              </option>

              <option value="COUPLE">
                Couple
              </option>

              <option value="FAMILY">
                Family
              </option>

              <option value="OUTDOOR">
                Outdoor
              </option>

              <option value="VIP">
                VIP
              </option>

              <option value="BAR">
                Bar
              </option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Capacity *</Label>

            <Input
              type="number"
              min={1}
              {...register(
                "capacity",
                {
                  valueAsNumber: true,
                },
              )}
            />

            {errors.capacity && (
              <p className="text-sm text-destructive">
                {errors.capacity.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Description</Label>

            <textarea
              {...register(
                "description",
              )}
              placeholder="Optional table description"
              className="min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none"
            />
          </div>

          <div className="flex justify-end gap-3">
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
                : isEditing
                  ? "Update Table"
                  : "Create Table"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}