import { useEffect, useState } from "react";
import {
  Loader2,
  Save,
  X,
} from "lucide-react";

import type {
  CreateSupplierData,
  Supplier,
  UpdateSupplierData,
} from "@/types/supplier.types";

interface SupplierFormDialogProps {
  open: boolean;
  mode: "create" | "edit";
  supplier?: Supplier | null;
  restaurantId: string;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (
    data: CreateSupplierData | UpdateSupplierData,
  ) => Promise<void>;
}

interface FormState {
  name: string;
  companyName: string;
  email: string;
  phone: string;
  branchId: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gstNumber: string;
  contactPerson: string;
  notes: string;
}

const emptyForm: FormState = {
  name: "",
  companyName: "",
  email: "",
  phone: "",
  branchId: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  gstNumber: "",
  contactPerson: "",
  notes: "",
};

function SupplierFormDialog({
  open,
  mode,
  supplier,
  restaurantId,
  submitting = false,
  onClose,
  onSubmit,
}: SupplierFormDialogProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});

  useEffect(() => {
    if (!open) {
      return;
    }

    if (mode === "edit" && supplier) {
      setForm({
        name: supplier.name ?? "",
        companyName: supplier.companyName ?? "",
        email: supplier.email ?? "",
        phone: supplier.phone ?? "",
        branchId: supplier.branchId ?? "",
        address: supplier.address ?? "",
        city: supplier.city ?? "",
        state: supplier.state ?? "",
        pincode: supplier.pincode ?? "",
        gstNumber: supplier.gstNumber ?? "",
        contactPerson: supplier.contactPerson ?? "",
        notes: supplier.notes ?? "",
      });
    } else {
      setForm(emptyForm);
    }

    setErrors({});
  }, [open, mode, supplier]);

  if (!open) {
    return null;
  }

  const updateField = (
    field: keyof FormState,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  };

  const validate = () => {
    const nextErrors: Partial<
      Record<keyof FormState, string>
    > = {};

    if (form.name.trim().length < 2) {
      nextErrors.name =
        "Supplier name must be at least 2 characters.";
    } else if (form.name.trim().length > 150) {
      nextErrors.name =
        "Supplier name cannot exceed 150 characters.";
    }

    if (form.companyName.length > 150) {
      nextErrors.companyName =
        "Company name cannot exceed 150 characters.";
    }

    if (form.email.trim()) {
      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(form.email.trim())) {
        nextErrors.email = "Enter a valid email address.";
      }
    }

    if (
      form.phone.trim().length < 5 ||
      form.phone.trim().length > 20
    ) {
      nextErrors.phone =
        "Phone number must be between 5 and 20 characters.";
    }

    if (form.address.length > 300) {
      nextErrors.address =
        "Address cannot exceed 300 characters.";
    }

    if (form.city.length > 100) {
      nextErrors.city =
        "City cannot exceed 100 characters.";
    }

    if (form.state.length > 100) {
      nextErrors.state =
        "State cannot exceed 100 characters.";
    }

    if (form.pincode.length > 20) {
      nextErrors.pincode =
        "Pincode cannot exceed 20 characters.";
    }

    if (form.gstNumber.length > 30) {
      nextErrors.gstNumber =
        "GST number cannot exceed 30 characters.";
    }

    if (form.contactPerson.length > 150) {
      nextErrors.contactPerson =
        "Contact person cannot exceed 150 characters.";
    }

    if (form.notes.length > 1000) {
      nextErrors.notes =
        "Notes cannot exceed 1000 characters.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    if (mode === "create") {
      const data: CreateSupplierData = {
        restaurantId,
        name: form.name.trim(),
        phone: form.phone.trim(),
        ...(form.companyName.trim() && {
          companyName: form.companyName.trim(),
        }),
        ...(form.email.trim() && {
          email: form.email.trim(),
        }),
        ...(form.branchId.trim() && {
          branchId: form.branchId.trim(),
        }),
        ...(form.address.trim() && {
          address: form.address.trim(),
        }),
        ...(form.city.trim() && {
          city: form.city.trim(),
        }),
        ...(form.state.trim() && {
          state: form.state.trim(),
        }),
        ...(form.pincode.trim() && {
          pincode: form.pincode.trim(),
        }),
        ...(form.gstNumber.trim() && {
          gstNumber: form.gstNumber.trim(),
        }),
        ...(form.contactPerson.trim() && {
          contactPerson: form.contactPerson.trim(),
        }),
        ...(form.notes.trim() && {
          notes: form.notes.trim(),
        }),
      };

      await onSubmit(data);
      return;
    }

    const data: UpdateSupplierData = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      ...(form.companyName.trim() && {
        companyName: form.companyName.trim(),
      }),
      ...(form.email.trim() && {
        email: form.email.trim(),
      }),
      ...(form.branchId.trim() && {
        branchId: form.branchId.trim(),
      }),
      ...(form.address.trim() && {
        address: form.address.trim(),
      }),
      ...(form.city.trim() && {
        city: form.city.trim(),
      }),
      ...(form.state.trim() && {
        state: form.state.trim(),
      }),
      ...(form.pincode.trim() && {
        pincode: form.pincode.trim(),
      }),
      ...(form.gstNumber.trim() && {
        gstNumber: form.gstNumber.trim(),
      }),
      ...(form.contactPerson.trim() && {
        contactPerson: form.contactPerson.trim(),
      }),
      ...(form.notes.trim() && {
        notes: form.notes.trim(),
      }),
    };

    await onSubmit(data);
  };

  const inputClassName =
    "h-10 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 outline-none transition focus:border-[#FF6B35] focus:bg-white focus:ring-2 focus:ring-[#FF6B35]/10";

  const textareaClassName =
    "min-h-[90px] w-full resize-y rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-[#FF6B35] focus:bg-white focus:ring-2 focus:ring-[#FF6B35]/10";

  const fieldErrorClassName =
    "mt-1 text-xs text-red-600";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !submitting) {
          onClose();
        }
      }}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="supplier-form-title"
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#FF6B35]">
              Supplier Management
            </p>

            <h2
              id="supplier-form-title"
              className="mt-1 text-xl font-bold text-gray-900"
            >
              {mode === "create"
                ? "Add Supplier"
                : "Edit Supplier"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto"
        >
          <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="supplier-name"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Supplier Name *
              </label>

              <input
                id="supplier-name"
                value={form.name}
                onChange={(event) =>
                  updateField("name", event.target.value)
                }
                className={inputClassName}
                placeholder="Enter supplier name"
                maxLength={150}
                disabled={submitting}
              />

              {errors.name && (
                <p className={fieldErrorClassName}>
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="supplier-company"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Company Name
              </label>

              <input
                id="supplier-company"
                value={form.companyName}
                onChange={(event) =>
                  updateField(
                    "companyName",
                    event.target.value,
                  )
                }
                className={inputClassName}
                placeholder="Enter company name"
                maxLength={150}
                disabled={submitting}
              />

              {errors.companyName && (
                <p className={fieldErrorClassName}>
                  {errors.companyName}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="supplier-phone"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Phone *
              </label>

              <input
                id="supplier-phone"
                value={form.phone}
                onChange={(event) =>
                  updateField("phone", event.target.value)
                }
                className={inputClassName}
                placeholder="Enter phone number"
                maxLength={20}
                disabled={submitting}
              />

              {errors.phone && (
                <p className={fieldErrorClassName}>
                  {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="supplier-email"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Email
              </label>

              <input
                id="supplier-email"
                type="email"
                value={form.email}
                onChange={(event) =>
                  updateField("email", event.target.value)
                }
                className={inputClassName}
                placeholder="supplier@example.com"
                disabled={submitting}
              />

              {errors.email && (
                <p className={fieldErrorClassName}>
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="supplier-branch"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Branch ID
                <span className="ml-1 text-xs text-gray-400">
                  (optional)
                </span>
              </label>

              <input
                id="supplier-branch"
                value={form.branchId}
                onChange={(event) =>
                  updateField(
                    "branchId",
                    event.target.value,
                  )
                }
                className={inputClassName}
                placeholder="Enter branch ID"
                disabled={submitting}
              />
            </div>

            <div>
              <label
                htmlFor="supplier-contact"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Contact Person
              </label>

              <input
                id="supplier-contact"
                value={form.contactPerson}
                onChange={(event) =>
                  updateField(
                    "contactPerson",
                    event.target.value,
                  )
                }
                className={inputClassName}
                placeholder="Enter contact person"
                maxLength={150}
                disabled={submitting}
              />

              {errors.contactPerson && (
                <p className={fieldErrorClassName}>
                  {errors.contactPerson}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="supplier-gst"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                GST Number
              </label>

              <input
                id="supplier-gst"
                value={form.gstNumber}
                onChange={(event) =>
                  updateField(
                    "gstNumber",
                    event.target.value,
                  )
                }
                className={inputClassName}
                placeholder="Enter GST number"
                maxLength={30}
                disabled={submitting}
              />

              {errors.gstNumber && (
                <p className={fieldErrorClassName}>
                  {errors.gstNumber}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="supplier-city"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                City
              </label>

              <input
                id="supplier-city"
                value={form.city}
                onChange={(event) =>
                  updateField("city", event.target.value)
                }
                className={inputClassName}
                placeholder="Enter city"
                maxLength={100}
                disabled={submitting}
              />

              {errors.city && (
                <p className={fieldErrorClassName}>
                  {errors.city}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="supplier-state"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                State
              </label>

              <input
                id="supplier-state"
                value={form.state}
                onChange={(event) =>
                  updateField("state", event.target.value)
                }
                className={inputClassName}
                placeholder="Enter state"
                maxLength={100}
                disabled={submitting}
              />

              {errors.state && (
                <p className={fieldErrorClassName}>
                  {errors.state}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="supplier-pincode"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Pincode
              </label>

              <input
                id="supplier-pincode"
                value={form.pincode}
                onChange={(event) =>
                  updateField(
                    "pincode",
                    event.target.value,
                  )
                }
                className={inputClassName}
                placeholder="Enter pincode"
                maxLength={20}
                disabled={submitting}
              />

              {errors.pincode && (
                <p className={fieldErrorClassName}>
                  {errors.pincode}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="supplier-address"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Address
              </label>

              <textarea
                id="supplier-address"
                value={form.address}
                onChange={(event) =>
                  updateField(
                    "address",
                    event.target.value,
                  )
                }
                className={textareaClassName}
                placeholder="Enter supplier address"
                maxLength={300}
                disabled={submitting}
              />

              {errors.address && (
                <p className={fieldErrorClassName}>
                  {errors.address}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="supplier-notes"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Notes
              </label>

              <textarea
                id="supplier-notes"
                value={form.notes}
                onChange={(event) =>
                  updateField("notes", event.target.value)
                }
                className={textareaClassName}
                placeholder="Additional supplier notes..."
                maxLength={1000}
                disabled={submitting}
              />

              {errors.notes && (
                <p className={fieldErrorClassName}>
                  {errors.notes}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#FF6B35] px-5 text-sm font-semibold text-white transition hover:bg-[#e85b2b] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}

              {mode === "create"
                ? "Create Supplier"
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SupplierFormDialog;