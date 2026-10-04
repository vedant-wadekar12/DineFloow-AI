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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Input,
} from "@/components/ui/input";

import {
  Button,
} from "@/components/ui/button";

import type {
  StaffMember,
} from "@/types/staff.types";

const staffSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(
        2,
        "First name must be at least 2 characters",
      ),

    lastName: z
      .string()
      .trim()
      .min(
        2,
        "Last name must be at least 2 characters",
      ),

    email: z
      .string()
      .trim()
      .email(
        "Enter a valid email address",
      ),

    phone: z
      .string()
      .optional(),

    password: z
      .string()
      .optional(),

    confirmPassword: z
      .string()
      .optional(),

    role: z.enum([
      "RESTAURANT_OWNER",
      "BRANCH_MANAGER",
      "CASHIER",
      "WAITER",
      "CHEF",
      "KITCHEN_STAFF",
    ]),

    branchId: z
      .string()
      .optional(),

    isActive: z.boolean(),
  })
  .refine(
    (data) => {
      if (
        data.password &&
        data.password !==
          data.confirmPassword
      ) {
        return false;
      }

      return true;
    },
    {
      message:
        "Passwords do not match",
      path: ["confirmPassword"],
    },
  );

type StaffFormData = z.infer<
  typeof staffSchema
>;

interface StaffFormDialogProps {
  open: boolean;

  staff?: StaffMember | null;

  loading?: boolean;

  onOpenChange: (
    open: boolean,
  ) => void;

  onSubmit: (
    data: StaffFormData,
  ) => Promise<void>;
}

export default function StaffFormDialog({
  open,
  staff,
  loading = false,
  onOpenChange,
  onSubmit,
}: StaffFormDialogProps) {
  const form =
    useForm<StaffFormData>({
      resolver:
        zodResolver(staffSchema),

      defaultValues: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        role: "WAITER",
        branchId: "",
        isActive: true,
      },
    });

  useEffect(() => {
    if (staff) {
      form.reset({
        firstName:
          staff.firstName,
        lastName:
          staff.lastName,
        email: staff.email,
        phone:
          staff.phone ?? "",
        password: "",
        confirmPassword: "",
        role: staff.role as
          | "RESTAURANT_OWNER"
          | "BRANCH_MANAGER"
          | "CASHIER"
          | "WAITER"
          | "CHEF"
          | "KITCHEN_STAFF",
        branchId:
          staff.branchId ?? "",
        isActive:
          staff.isActive,
      });
    } else {
      form.reset({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        role: "WAITER",
        branchId: "",
        isActive: true,
      });
    }
  }, [staff, open]);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {staff
              ? "Edit Staff Member"
              : "Add Staff Member"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(
            onSubmit,
          )}
          className="space-y-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">
                First Name
              </label>

              <Input
                {...form.register(
                  "firstName",
                )}
                placeholder="First name"
              />

              {form.formState.errors
                .firstName && (
                <p className="mt-1 text-sm text-red-500">
                  {
                    form.formState
                      .errors.firstName
                      .message
                  }
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Last Name
              </label>

              <Input
                {...form.register(
                  "lastName",
                )}
                placeholder="Last name"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Email
            </label>

            <Input
              type="email"
              {...form.register(
                "email",
              )}
              placeholder="staff@example.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Phone
            </label>

            <Input
              {...form.register(
                "phone",
              )}
              placeholder="Phone number"
            />
          </div>

          {!staff && (
            <>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Password
                </label>

                <Input
                  type="password"
                  {...form.register(
                    "password",
                  )}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Confirm Password
                </label>

                <Input
                  type="password"
                  {...form.register(
                    "confirmPassword",
                  )}
                />
              </div>
            </>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium">
              Role
            </label>

            <select
              {...form.register(
                "role",
              )}
              className="w-full rounded-md border bg-background px-3 py-2"
            >
              <option value="BRANCH_MANAGER">
                Branch Manager
              </option>

              <option value="CASHIER">
                Cashier
              </option>

              <option value="WAITER">
                Waiter
              </option>

              <option value="CHEF">
                Chef
              </option>

              <option value="KITCHEN_STAFF">
                Kitchen Staff
              </option>

              <option value="RESTAURANT_OWNER">
                Restaurant Owner
              </option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Branch ID
            </label>

            <Input
              {...form.register(
                "branchId",
              )}
              placeholder="Branch ID"
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              {...form.register(
                "isActive",
              )}
            />

            Active
          </label>

          <div className="flex justify-end gap-2">
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
                : staff
                  ? "Update Staff"
                  : "Create Staff"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}