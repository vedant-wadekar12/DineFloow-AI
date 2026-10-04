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
  name: z
    .string()
    .min(2, "Branch name is required"),

  code: z
    .string()
    .optional(),

  phone: z
    .string()
    .optional(),

  email: z
    .string()
    .email("Enter a valid email")
    .optional()
    .or(z.literal("")),

  address: z
    .string()
    .min(2, "Address is required"),

  city: z
    .string()
    .min(2, "City is required"),

  state: z
    .string()
    .min(2, "State is required"),

  country: z
    .string()
    .min(2, "Country is required"),

  postalCode: z
    .string()
    .min(3, "Postal code is required"),

  timezone: z
    .string()
    .optional(),

  currency: z
    .string()
    .optional(),
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
      address: "",
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
        address: branch.address || "",
        city: branch.city || "",
        state: branch.state || "",
        country: branch.country || "India",
        postalCode: branch.postalCode || "",
        timezone: branch.timezone || "Asia/Kolkata",
        currency: branch.currency || "INR",
      });
    } else {
      reset({
        name: "",
        code: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        state: "",
        country: "India",
        postalCode: "",
        timezone: "Asia/Kolkata",
        currency: "INR",
      });
    }
  }, [branch, reset]);

  const submitForm = async (
    values: FormValues,
  ) => {
    const data: CreateBranchData = {
      restaurantId,

      name: values.name,

      code:
        values.code || undefined,

      phone:
        values.phone || undefined,

      email:
        values.email || undefined,

      address: values.address,

      city: values.city,

      state: values.state,

      country: values.country,

      postalCode: values.postalCode,

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
                placeholder="Main Branch"
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
                placeholder="MAIN-01"
              />

              {errors.code && (
                <p className="text-sm text-destructive">
                  {errors.code.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Phone</Label>

              <Input
                {...register("phone")}
                placeholder="9876543210"
              />

              {errors.phone && (
                <p className="text-sm text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Email</Label>

              <Input
                {...register("email")}
                type="email"
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

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Address *</Label>

                <Input
                  {...register("address")}
                  placeholder="123 Main Street"
                />

                {errors.address && (
                  <p className="text-sm text-destructive">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>City *</Label>

                  <Input
                    {...register("city")}
                    placeholder="Mumbai"
                  />

                  {errors.city && (
                    <p className="text-sm text-destructive">
                      {errors.city.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>State *</Label>

                  <Input
                    {...register("state")}
                    placeholder="Maharashtra"
                  />

                  {errors.state && (
                    <p className="text-sm text-destructive">
                      {errors.state.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Country *</Label>

                  <Input
                    {...register("country")}
                    placeholder="India"
                  />

                  {errors.country && (
                    <p className="text-sm text-destructive">
                      {errors.country.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Postal Code *</Label>

                  <Input
                    {...register("postalCode")}
                    placeholder="400001"
                  />

                  {errors.postalCode && (
                    <p className="text-sm text-destructive">
                      {errors.postalCode.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Timezone</Label>

              <Input
                {...register("timezone")}
                placeholder="Asia/Kolkata"
              />
            </div>

            <div className="space-y-2">
              <Label>Currency</Label>

              <Input
                {...register("currency")}
                placeholder="INR"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
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
                  ? "Update Branch"
                  : "Create Branch"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}