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
  Floor,
  CreateFloorData,
} from "@/types/floor.types";

const floorSchema = z.object({
  name: z.string().min(
    2,
    "Floor name is required",
  ),

  code: z.string().optional(),

  description: z.string().optional(),

  floorNumber: z
    .string()
    .optional(),
});

type FormValues =
  z.infer<typeof floorSchema>;

interface FloorFormDialogProps {
  open: boolean;

  floor?: Floor | null;

  restaurantId: string;
  branchId: string;

  loading?: boolean;

  onOpenChange: (open: boolean) => void;

  onSubmit: (
    data: CreateFloorData,
  ) => Promise<void>;
}

export default function FloorFormDialog({
  open,
  floor,
  restaurantId,
  branchId,
  loading = false,
  onOpenChange,
  onSubmit,
}: FloorFormDialogProps) {
  const isEditing = Boolean(floor);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(floorSchema),

    defaultValues: {
      name: "",
      code: "",
      description: "",
      floorNumber: "",
    },
  });

  useEffect(() => {
    if (floor) {
      reset({
        name: floor.name,
        code: floor.code || "",
        description:
          floor.description || "",
        floorNumber:
          floor.floorNumber?.toString() || "",
      });
    } else {
      reset();
    }
  }, [floor, reset]);

  const submitForm = async (
    values: FormValues,
  ) => {
    const data: CreateFloorData = {
      restaurantId,
      branchId,

      name: values.name,

      code:
        values.code || undefined,

      description:
        values.description || undefined,

      floorNumber:
        values.floorNumber
          ? Number(values.floorNumber)
          : undefined,
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
              ? "Edit Floor"
              : "Create Floor"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(submitForm)}
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label>Floor Name *</Label>

            <Input
              {...register("name")}
              placeholder="Ground Floor"
            />

            {errors.name && (
              <p className="text-sm text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Floor Code</Label>

            <Input
              {...register("code")}
              placeholder="GF"
            />
          </div>

          <div className="space-y-2">
            <Label>Floor Number</Label>

            <Input
              type="number"
              {...register("floorNumber")}
              placeholder="1"
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>

            <textarea
              {...register("description")}
              placeholder="Main dining area"
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
                  ? "Update Floor"
                  : "Create Floor"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}