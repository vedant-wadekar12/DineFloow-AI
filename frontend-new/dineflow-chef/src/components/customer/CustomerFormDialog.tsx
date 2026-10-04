import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  X,
} from "lucide-react";

import type {
  CreateCustomerData,
  Customer,
  CustomerAddress,
  UpdateCustomerData,
} from "@/types/customer.types";

interface CustomerFormDialogProps {
  open: boolean;
  customer?: Customer | null;
  restaurantId: string;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (
    data:
      | CreateCustomerData
      | UpdateCustomerData,
  ) => Promise<void>;
}

interface AddressForm extends CustomerAddress {
  localId: string;
}

function createAddress(): AddressForm {
  return {
    localId: crypto.randomUUID(),
    label: "Home",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    isDefault: true,
  };
}

function CustomerFormDialog({
  open,
  customer,
  restaurantId,
  isSubmitting,
  onClose,
  onSubmit,
}: CustomerFormDialogProps) {
  const isEdit = Boolean(customer);

  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [profileImage, setProfileImage] =
    useState("");

  const [dateOfBirth, setDateOfBirth] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [addresses, setAddresses] =
    useState<AddressForm[]>([]);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    if (customer) {
      setFirstName(customer.firstName);
      setLastName(customer.lastName ?? "");
      setEmail(customer.email ?? "");
      setPhone(customer.phone);
      setProfileImage(
        customer.profileImage ?? "",
      );

      setDateOfBirth(
        customer.dateOfBirth
          ? customer.dateOfBirth.slice(0, 10)
          : "",
      );

      setNotes(customer.notes ?? "");

      setAddresses(
        customer.addresses.map(
          (address) => ({
            ...address,
            localId:
              address._id ??
              crypto.randomUUID(),
          }),
        ),
      );
    } else {
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setProfileImage("");
      setDateOfBirth("");
      setNotes("");
      setAddresses([]);
    }

    setError("");
  }, [open, customer]);

  if (!open) {
    return null;
  }

  const updateAddress = (
    localId: string,
    field: keyof CustomerAddress,
    value: string | boolean,
  ) => {
    setAddresses((current) =>
      current.map((address) =>
        address.localId === localId
          ? {
              ...address,
              [field]: value,
            }
          : field === "isDefault" &&
              value === true
            ? {
                ...address,
                isDefault: false,
              }
            : address,
      ),
    );
  };

  const removeAddress = (
    localId: string,
  ) => {
    setAddresses((current) =>
      current.filter(
        (address) =>
          address.localId !== localId,
      ),
    );
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setError("");

    if (!firstName.trim()) {
      setError("First name is required.");
      return;
    }

    if (phone.trim().length < 5) {
      setError(
        "Please enter a valid phone number.",
      );
      return;
    }

    const cleanAddresses =
      addresses.map(
        ({
          localId: _localId,
          _id,
          ...address
        }) => ({
          ...address,
          label: address.label.trim(),
          addressLine1:
            address.addressLine1.trim(),
        }),
      );

    const invalidAddress =
      cleanAddresses.find(
        (address) =>
          !address.label ||
          !address.addressLine1,
      );

    if (invalidAddress) {
      setError(
        "Each address needs a label and address line 1.",
      );
      return;
    }

    try {
      if (isEdit) {
        await onSubmit({
          firstName: firstName.trim(),
          lastName:
            lastName.trim() || undefined,
          email: email.trim() || undefined,
          phone: phone.trim(),
          profileImage:
            profileImage.trim() || undefined,
          addresses: cleanAddresses,
          dateOfBirth:
            dateOfBirth || undefined,
          notes: notes.trim() || undefined,
        });
      } else {
        await onSubmit({
          restaurantId,
          firstName: firstName.trim(),
          lastName:
            lastName.trim() || undefined,
          email: email.trim() || undefined,
          phone: phone.trim(),
          profileImage:
            profileImage.trim() || undefined,
          addresses: cleanAddresses,
          dateOfBirth:
            dateOfBirth || undefined,
          notes: notes.trim() || undefined,
        });
      }
    } catch {
      setError(
        "Unable to save customer. Please try again.",
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {isEdit
                ? "Edit Customer"
                : "Add Customer"}
            </h2>

            <p className="mt-0.5 text-sm text-gray-500">
              {isEdit
                ? "Update customer information."
                : "Create a new restaurant customer."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto"
        >
          <div className="space-y-6 p-6">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <section>
              <h3 className="mb-4 text-sm font-semibold text-gray-900">
                Basic Information
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-gray-700">
                    First name *
                  </span>

                  <input
                    value={firstName}
                    onChange={(event) =>
                      setFirstName(
                        event.target.value,
                      )
                    }
                    className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/10"
                    required
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-gray-700">
                    Last name
                  </span>

                  <input
                    value={lastName}
                    onChange={(event) =>
                      setLastName(
                        event.target.value,
                      )
                    }
                    className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/10"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-gray-700">
                    Phone *
                  </span>

                  <input
                    value={phone}
                    onChange={(event) =>
                      setPhone(
                        event.target.value,
                      )
                    }
                    className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/10"
                    required
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-gray-700">
                    Email
                  </span>

                  <input
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(
                        event.target.value,
                      )
                    }
                    className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/10"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-gray-700">
                    Date of birth
                  </span>

                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(event) =>
                      setDateOfBirth(
                        event.target.value,
                      )
                    }
                    className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/10"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-gray-700">
                    Profile image URL
                  </span>

                  <input
                    type="url"
                    value={profileImage}
                    onChange={(event) =>
                      setProfileImage(
                        event.target.value,
                      )
                    }
                    placeholder="https://..."
                    className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/10"
                  />
                </label>
              </div>
            </section>

            <section>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Addresses
                  </h3>

                  <p className="mt-0.5 text-xs text-gray-500">
                    Add one or more customer addresses.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setAddresses(
                      (current) => [
                        ...current,
                        {
                          ...createAddress(),
                          isDefault:
                            current.length === 0,
                        },
                      ],
                    )
                  }
                  className="inline-flex items-center gap-1.5 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-semibold text-[#FF6B35] hover:bg-orange-100"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add address
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 px-4 py-6 text-center text-sm text-gray-500">
                  No addresses added.
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map(
                    (address, index) => (
                      <div
                        key={address.localId}
                        className="rounded-xl border border-gray-200 bg-gray-50/60 p-4"
                      >
                        <div className="mb-4 flex items-center justify-between">
                          <p className="text-sm font-semibold text-gray-800">
                            Address {index + 1}
                          </p>

                          <button
                            type="button"
                            onClick={() =>
                              removeAddress(
                                address.localId,
                              )
                            }
                            className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <input
                            value={
                              address.label
                            }
                            onChange={(event) =>
                              updateAddress(
                                address.localId,
                                "label",
                                event.target.value,
                              )
                            }
                            placeholder="Label e.g. Home"
                            className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[#FF6B35]"
                          />

                          <input
                            value={
                              address.addressLine1
                            }
                            onChange={(event) =>
                              updateAddress(
                                address.localId,
                                "addressLine1",
                                event.target.value,
                              )
                            }
                            placeholder="Address line 1"
                            className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[#FF6B35]"
                          />

                          <input
                            value={
                              address.addressLine2 ??
                              ""
                            }
                            onChange={(event) =>
                              updateAddress(
                                address.localId,
                                "addressLine2",
                                event.target.value,
                              )
                            }
                            placeholder="Address line 2"
                            className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[#FF6B35]"
                          />

                          <input
                            value={
                              address.city ?? ""
                            }
                            onChange={(event) =>
                              updateAddress(
                                address.localId,
                                "city",
                                event.target.value,
                              )
                            }
                            placeholder="City"
                            className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[#FF6B35]"
                          />

                          <input
                            value={
                              address.state ?? ""
                            }
                            onChange={(event) =>
                              updateAddress(
                                address.localId,
                                "state",
                                event.target.value,
                              )
                            }
                            placeholder="State"
                            className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[#FF6B35]"
                          />

                          <input
                            value={
                              address.postalCode ??
                              ""
                            }
                            onChange={(event) =>
                              updateAddress(
                                address.localId,
                                "postalCode",
                                event.target.value,
                              )
                            }
                            placeholder="Postal code"
                            className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[#FF6B35]"
                          />

                          <input
                            value={
                              address.country ??
                              "India"
                            }
                            onChange={(event) =>
                              updateAddress(
                                address.localId,
                                "country",
                                event.target.value,
                              )
                            }
                            placeholder="Country"
                            className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[#FF6B35]"
                          />

                          <label className="flex items-center gap-2 text-sm text-gray-700">
                            <input
                              type="checkbox"
                              checked={
                                Boolean(
                                  address.isDefault,
                                )
                              }
                              onChange={(event) =>
                                updateAddress(
                                  address.localId,
                                  "isDefault",
                                  event.target
                                    .checked,
                                )
                              }
                              className="h-4 w-4 rounded border-gray-300 accent-[#FF6B35]"
                            />

                            Default address
                          </label>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}
            </section>

            <section>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-gray-700">
                  Notes
                </span>

                <textarea
                  value={notes}
                  onChange={(event) =>
                    setNotes(event.target.value)
                  }
                  rows={4}
                  maxLength={1000}
                  placeholder="Additional customer notes..."
                  className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/10"
                />
              </label>
            </section>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50/60 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[#FF6B35] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e85a29] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Saving..."
                : isEdit
                  ? "Save Changes"
                  : "Create Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CustomerFormDialog;