import {
  useEffect,
  useState,
} from "react";

import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  z,
} from "zod";

import type {
  Restaurant,
} from "@/types/restaurant.types";

const restaurantSchema = z.object({
  name: z
    .string()
    .min(
      2,
      "Restaurant name must be at least 2 characters",
    )
    .max(
      100,
      "Restaurant name cannot exceed 100 characters",
    ),

  slug: z
    .string()
    .min(
      2,
      "Slug must be at least 2 characters",
    )
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers and hyphens only",
    ),

  description: z
    .string()
    .max(
      500,
      "Description cannot exceed 500 characters",
    )
    .optional(),

  email: z
    .string()
    .email("Enter a valid email")
    .optional()
    .or(z.literal("")),

  phone: z
    .string()
    .max(
      20,
      "Phone number is too long",
    )
    .optional(),

  address: z
    .string()
    .max(
      250,
      "Address is too long",
    )
    .optional(),

  city: z
    .string()
    .max(80)
    .optional(),

  state: z
    .string()
    .max(80)
    .optional(),

  country: z
    .string()
    .max(80)
    .optional(),

  postalCode: z
    .string()
    .max(20)
    .optional(),

  currency: z
    .string()
    .min(1, "Currency is required"),

  timezone: z
    .string()
    .min(1, "Timezone is required"),
});

export type RestaurantFormValues =
  z.infer<typeof restaurantSchema>;

interface RestaurantFormProps {
  restaurant?: Restaurant | null;
  onSubmit: (
    data: RestaurantFormValues,
  ) => Promise<void>;
  onCancel: () => void;
}

function RestaurantForm({
  restaurant,
  onSubmit,
  onCancel,
}: RestaurantFormProps) {
  const [serverError, setServerError] =
    useState("");

  const isEditing = Boolean(restaurant);

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<RestaurantFormValues>({
    resolver: zodResolver(
      restaurantSchema,
    ),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      country: "India",
      postalCode: "",
      currency: "INR",
      timezone: "Asia/Kolkata",
    },
  });

  useEffect(() => {
    if (!restaurant) {
      reset({
        name: "",
        slug: "",
        description: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        country: "India",
        postalCode: "",
        currency: "INR",
        timezone: "Asia/Kolkata",
      });

      return;
    }

    reset({
      name: restaurant.name,
      slug: restaurant.slug,
      description:
        restaurant.description ?? "",
      email: restaurant.email ?? "",
      phone: restaurant.phone ?? "",
      address: restaurant.address ?? "",
      city: restaurant.city ?? "",
      state: restaurant.state ?? "",
      country:
        restaurant.country ?? "India",
      postalCode:
        restaurant.postalCode ?? "",
      currency:
        restaurant.currency ?? "INR",
      timezone:
        restaurant.timezone ??
        "Asia/Kolkata",
    });
  }, [restaurant, reset]);

  const submit = async (
    data: RestaurantFormValues,
  ) => {
    try {
      setServerError("");
      await onSubmit(data);
    } catch (error: any) {
      setServerError(
        error?.response?.data?.message ||
          "Unable to save restaurant. Please try again.",
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="space-y-6"
    >
      {serverError && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {serverError}
        </div>
      )}

      {/* Basic information */}
      <section>
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900">
            Basic Information
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            Core information about your restaurant.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Restaurant Name"
            required
            error={errors.name?.message}
          >
            <input
              {...register("name")}
              placeholder="e.g. The Spice Kitchen"
              className={inputClass(
                Boolean(errors.name),
              )}
            />
          </Field>

          <Field
            label="Slug"
            required
            error={errors.slug?.message}
          >
            <input
              {...register("slug")}
              placeholder="the-spice-kitchen"
              className={inputClass(
                Boolean(errors.slug),
              )}
            />
          </Field>
        </div>

        <div className="mt-4">
          <Field
            label="Description"
            error={errors.description?.message}
          >
            <textarea
              {...register("description")}
              rows={4}
              placeholder="Tell customers about your restaurant..."
              className={`${inputClass(
                Boolean(errors.description),
              )} resize-none py-3`}
            />
          </Field>
        </div>
      </section>

      {/* Contact */}
      <section className="border-t border-gray-100 pt-6">
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900">
            Contact Information
          </h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Email"
            error={errors.email?.message}
          >
            <input
              type="email"
              {...register("email")}
              placeholder="restaurant@example.com"
              className={inputClass(
                Boolean(errors.email),
              )}
            />
          </Field>

          <Field
            label="Phone"
            error={errors.phone?.message}
          >
            <input
              {...register("phone")}
              placeholder="+91 98765 43210"
              className={inputClass(
                Boolean(errors.phone),
              )}
            />
          </Field>
        </div>
      </section>

      {/* Address */}
      <section className="border-t border-gray-100 pt-6">
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900">
            Location
          </h3>
        </div>

        <div>
          <Field
            label="Address"
            error={errors.address?.message}
          >
            <input
              {...register("address")}
              placeholder="Street address"
              className={inputClass(
                Boolean(errors.address),
              )}
            />
          </Field>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field
            label="City"
            error={errors.city?.message}
          >
            <input
              {...register("city")}
              placeholder="Mumbai"
              className={inputClass(
                Boolean(errors.city),
              )}
            />
          </Field>

          <Field
            label="State"
            error={errors.state?.message}
          >
            <input
              {...register("state")}
              placeholder="Maharashtra"
              className={inputClass(
                Boolean(errors.state),
              )}
            />
          </Field>

          <Field
            label="Country"
            error={errors.country?.message}
          >
            <input
              {...register("country")}
              className={inputClass(
                Boolean(errors.country),
              )}
            />
          </Field>

          <Field
            label="Postal Code"
            error={errors.postalCode?.message}
          >
            <input
              {...register("postalCode")}
              placeholder="400001"
              className={inputClass(
                Boolean(errors.postalCode),
              )}
            />
          </Field>
        </div>
      </section>

      {/* Regional settings */}
      <section className="border-t border-gray-100 pt-6">
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900">
            Regional Settings
          </h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Currency"
            required
            error={errors.currency?.message}
          >
            <select
              {...register("currency")}
              className={inputClass(
                Boolean(errors.currency),
              )}
            >
              <option value="INR">
                INR — Indian Rupee
              </option>

              <option value="USD">
                USD — US Dollar
              </option>

              <option value="EUR">
                EUR — Euro
              </option>

              <option value="GBP">
                GBP — British Pound
              </option>
            </select>
          </Field>

          <Field
            label="Timezone"
            required
            error={errors.timezone?.message}
          >
            <select
              {...register("timezone")}
              className={inputClass(
                Boolean(errors.timezone),
              )}
            >
              <option value="Asia/Kolkata">
                Asia/Kolkata
              </option>

              <option value="Asia/Dubai">
                Asia/Dubai
              </option>

              <option value="Europe/London">
                Europe/London
              </option>

              <option value="America/New_York">
                America/New_York
              </option>

              <option value="America/Los_Angeles">
                America/Los_Angeles
              </option>
            </select>
          </Field>
        </div>
      </section>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="h-11 rounded-xl border border-gray-200 px-5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-11 rounded-xl bg-[#FF6B35] px-5 text-sm font-semibold text-white transition hover:bg-[#e85a27] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "Saving..."
            : isEditing
              ? "Save Changes"
              : "Create Restaurant"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}

        {required && (
          <span className="ml-1 text-[#FF6B35]">
            *
          </span>
        )}
      </label>

      {children}

      {error && (
        <p className="mt-1.5 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return [
    "h-11 w-full rounded-xl border bg-gray-50 px-3 text-sm",
    "text-gray-900 outline-none transition",
    "placeholder:text-gray-400",
    "focus:bg-white focus:ring-2",
    hasError
      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
      : "border-gray-200 focus:border-[#FF6B35] focus:ring-orange-100",
  ].join(" ");
}

export default RestaurantForm;