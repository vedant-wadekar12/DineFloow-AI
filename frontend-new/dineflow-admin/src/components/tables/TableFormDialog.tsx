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
} from "@/types/table.types";

const tableSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Table name is required")
    .max(
      100,
      "Table name cannot exceed 100 characters",
    ),

  tableNumber: z.coerce
    .number()
    .int("Table number must be a whole number")
    .min(
      1,
      "Table number must be at least 1",
    ),

  type: z.enum([
    "STANDARD",
    "COUPLE",
    "FAMILY",
    "OUTDOOR",
    "VIP",
    "BAR",
  ]),

  capacity: z.coerce
    .number()
    .int("Capacity must be a whole number")
    .min(
      1,
      "Capacity must be at least 1",
    )
    .max(
      50,
      "Capacity cannot exceed 50",
    ),

  description: z
    .string()
    .trim()
    .max(
      300,
      "Description cannot exceed 300 characters",
    )
    .optional(),
});

type FormValues = z.output<
  typeof tableSchema
>;

interface TableFormDialogProps {
  open: boolean;
  table?: RestaurantTable | null;
  restaurantId: string;
  branchId: string;
  floorId: string;
  loading?: boolean;

  onOpenChange: (
    open: boolean,
  ) => void;

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
  const isEditing =
    table !== null &&
    table !== undefined;

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
      tableNumber: 1,
      type: "STANDARD",
      capacity: 2,
      description: "",
    },
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    if (table) {
      reset({
        name: table.name ?? "",
        tableNumber:
          table.tableNumber ?? 1,
        type:
          table.type ?? "STANDARD",
        capacity:
          table.capacity ?? 2,
        description:
          table.description ?? "",
      });

      return;
    }

    reset({
      name: "",
      tableNumber: 1,
      type: "STANDARD",
      capacity: 2,
      description: "",
    });
  }, [open, table, reset]);

  const submitForm = async (
    values: FormValues,
  ) => {
    const data: CreateTableData = {
      restaurantId,
      branchId,
      floorId,
      name: values.name,
      tableNumber:
        values.tableNumber,
      capacity:
        values.capacity,
      type: values.type,
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? "Edit Table"
              : "Add Table"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(
            submitForm,
          )}
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="table-name">
              Table Name
            </Label>

            <Input
              id="table-name"
              placeholder="Table 1"
              {...register("name")}
              disabled={loading}
            />

            {errors.name && (
              <p className="text-sm text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="table-number">
              Table Number
            </Label>

            <Input
              id="table-number"
              type="number"
              min={1}
              {...register(
                "tableNumber",
                {
                  valueAsNumber: true,
                },
              )}
              disabled={loading}
            />

            {errors.tableNumber && (
              <p className="text-sm text-destructive">
                {
                  errors.tableNumber
                    .message
                }
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="table-type">
              Table Type
            </Label>

            <select
              id="table-type"
              {...register("type")}
              disabled={loading}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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

            {errors.type && (
              <p className="text-sm text-destructive">
                {errors.type.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="table-capacity">
              Seating Capacity
            </Label>

            <Input
              id="table-capacity"
              type="number"
              min={1}
              max={50}
              {...register(
                "capacity",
                {
                  valueAsNumber: true,
                },
              )}
              disabled={loading}
            />

            {errors.capacity && (
              <p className="text-sm text-destructive">
                {
                  errors.capacity
                    .message
                }
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="table-description">
              Description
            </Label>

            <textarea
              id="table-description"
              placeholder="Optional description"
              {...register(
                "description",
              )}
              disabled={loading}
              className="flex min-h-[90px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />

            {errors.description && (
              <p className="text-sm text-destructive">
                {
                  errors.description
                    .message
                }
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                onOpenChange(false)
              }
              disabled={loading}
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