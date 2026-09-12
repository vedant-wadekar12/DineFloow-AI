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
  Branch,
  CreateBranchData,
} from "@/types/branch.types";

const branchSchema = z.object({
  name: z.string().min(2, "Branch name is required"),
  code: z.string().optional(),
  phone: z.string().optional(),
  email: z
    .string()
    .email("Enter a valid email")
    .optional()
    .or(z.literal("")),

  addressLine1: z.string().min(
    2,
    "Address is required",
  ),

  addressLine2: z.string().optional(),

  city: z.string().min(2, "City is required"),

  state: z.string().min(2, "State is required"),

  country: z.string().min(2, "Country is required"),

  postalCode: z.string().min(
    3,
    "Postal code is required",
  ),

  timezone: z.string().optional(),

  currency: z.string().optional(),
});

type FormValues = z.infer<typeof branchSchema>;

interface BranchFormDialogProps {
  open: boolean;
  branch?: Branch | null;
  restaurantId: string;
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    data: CreateBranchData,
  ) => Promise<void>;
}

export default function BranchFormDialog({
  open,
  branch,
  restaurantId,
  loading = false,
  onOpenChange,
  onSubmit,
}: BranchFormDialogProps) {
  const isEditing = Boolean(branch);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      name: "",
      code: "",
      phone: "",
      email: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      country: "India",
      postalCode: "",
      timezone: "Asia/Kolkata",
      currency: "INR",
    },
  });

  useEffect(() => {
    if (branch) {
      reset({
        name: branch.name,
        code: branch.code || "",
        phone: branch.phone || "",
        email: branch.email || "",
        addressLine1:
          branch.address.addressLine1,
        addressLine2:
          branch.address.addressLine2 || "",
        city: branch.address.city,
        state: branch.address.state,
        country: branch.address.country,
        postalCode:
          branch.address.postalCode,
        timezone:
          branch.timezone || "Asia/Kolkata",
        currency: branch.currency || "INR",
      });
    } else {
      reset();
    }
  }, [branch, reset]);

  const submitForm = async (
    values: FormValues,
  ) => {
    const data: CreateBranchData = {
      restaurantId,

      name: values.name,

      code: values.code || undefined,

      phone: values.phone || undefined,

      email: values.email || undefined,

      address: {
        addressLine1: values.addressLine1,
        addressLine2:
          values.addressLine2 || undefined,
        city: values.city,
        state: values.state,
        country: values.country,
        postalCode: values.postalCode,
      },

      timezone:
        values.timezone || undefined,

      currency:
        values.currency || undefined,
    };

    await onSubmit(data);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? "Edit Branch"
              : "Create Branch"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(submitForm)}
          className="space-y-6"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Branch Name *</Label>

              <Input
                {...register("name")}
                placeholder="Mumbai Central"
              />

              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Branch Code</Label>

              <Input
                {...register("code")}
                placeholder="MUM-001"
              />
            </div>

            <div className="space-y-2">
              <Label>Phone</Label>

              <Input
                {...register("phone")}
                placeholder="+91 9876543210"
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>

              <Input
                {...register("email")}
                placeholder="branch@example.com"
              />

              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">
              Address
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label>Address Line 1 *</Label>

                <Input
                  {...register("addressLine1")}
                  placeholder="123 Main Street"
                />

                {errors.addressLine1 && (
                  <p className="text-sm text-destructive">
                    {errors.addressLine1.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Address Line 2</Label>

                <Input
                  {...register("addressLine2")}
                  placeholder="Building / Floor / Landmark"
                />
              </div>

              <div className="space-y-2">
                <Label>City *</Label>

                <Input {...register("city")} />

                {errors.city && (
                  <p className="text-sm text-destructive">
                    {errors.city.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>State *</Label>

                <Input {...register("state")} />

                {errors.state && (
                  <p className="text-sm text-destructive">
                    {errors.state.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Country *</Label>

                <Input {...register("country")} />
              </div>

              <div className="space-y-2">
                <Label>Postal Code *</Label>

                <Input
                  {...register("postalCode")}
                />

                {errors.postalCode && (
                  <p className="text-sm text-destructive">
                    {errors.postalCode.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
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
                : isEditing
                  ? "Update Branch"
                  : "Create Branch"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}