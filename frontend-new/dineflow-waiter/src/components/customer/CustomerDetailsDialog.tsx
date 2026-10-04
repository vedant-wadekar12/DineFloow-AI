import {
  Calendar,
  Mail,
  MapPin,
  Phone,
  ShoppingBag,
  Wallet,
  X,
} from "lucide-react";

import CustomerStatusBadge from "./CustomerStatusBadge";

import type {
  Customer,
} from "@/types/customer.types";

interface CustomerDetailsDialogProps {
  customer: Customer | null;
  open: boolean;
  onClose: () => void;
}

function CustomerDetailsDialog({
  customer,
  open,
  onClose,
}: CustomerDetailsDialogProps) {
  if (!open || !customer) {
    return null;
  }

  const fullName =
    `${customer.firstName} ${customer.lastName ?? ""}`.trim();

  const initials =
    `${customer.firstName.charAt(0)}${customer.lastName?.charAt(0) ?? ""}`.toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="relative overflow-hidden bg-[#111827] px-6 py-7 text-white">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg p-2 text-gray-300 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-4">
            {customer.profileImage ? (
              <img
                src={customer.profileImage}
                alt={fullName}
                className="h-16 w-16 rounded-full border-2 border-white/20 object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FF6B35] text-xl font-bold">
                {initials}
              </div>
            )}

            <div>
              <h2 className="text-xl font-bold">
                {fullName}
              </h2>

              <p className="mt-1 text-sm text-gray-300">
                Customer
              </p>

              <div className="mt-2">
                <CustomerStatusBadge
                  status={customer.status}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 p-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <ShoppingBag className="h-5 w-5 text-[#FF6B35]" />

              <p className="mt-3 text-xs text-gray-500">
                Total Orders
              </p>

              <p className="mt-1 text-xl font-bold text-gray-900">
                {customer.totalOrders}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <Wallet className="h-5 w-5 text-[#FFB703]" />

              <p className="mt-3 text-xs text-gray-500">
                Total Spent
              </p>

              <p className="mt-1 text-xl font-bold text-gray-900">
                ₹
                {customer.totalSpent.toLocaleString(
                  "en-IN",
                )}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <Calendar className="h-5 w-5 text-[#06D6A0]" />

              <p className="mt-3 text-xs text-gray-500">
                Last Order
              </p>

              <p className="mt-1 text-sm font-bold text-gray-900">
                {customer.lastOrderAt
                  ? new Date(
                      customer.lastOrderAt,
                    ).toLocaleDateString()
                  : "No orders"}
              </p>
            </div>
          </div>

          <section>
            <h3 className="mb-3 text-sm font-semibold text-gray-900">
              Contact Information
            </h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Phone className="h-4 w-4 text-gray-400" />
                {customer.phone}
              </div>

              {customer.email && (
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <Mail className="h-4 w-4 text-gray-400" />
                  {customer.email}
                </div>
              )}

              {customer.dateOfBirth && (
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {new Date(
                    customer.dateOfBirth,
                  ).toLocaleDateString()}
                </div>
              )}
            </div>
          </section>

          {customer.addresses.length > 0 && (
            <section>
              <h3 className="mb-3 text-sm font-semibold text-gray-900">
                Addresses
              </h3>

              <div className="grid gap-3 sm:grid-cols-2">
                {customer.addresses.map(
                  (address) => (
                    <div
                      key={
                        address._id ??
                        `${address.label}-${address.addressLine1}`
                      }
                      className="rounded-xl border border-gray-200 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#FF6B35]" />

                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {address.label}
                            {address.isDefault &&
                              " · Default"}
                          </p>

                          <p className="mt-1 text-sm leading-5 text-gray-600">
                            {
                              address.addressLine1
                            }

                            {address.addressLine2 &&
                              `, ${address.addressLine2}`}

                            {address.city &&
                              `, ${address.city}`}

                            {address.state &&
                              `, ${address.state}`}

                            {address.postalCode &&
                              ` - ${address.postalCode}`}

                            {address.country &&
                              `, ${address.country}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </section>
          )}

          {customer.notes && (
            <section>
              <h3 className="mb-2 text-sm font-semibold text-gray-900">
                Notes
              </h3>

              <p className="rounded-xl bg-gray-50 p-4 text-sm leading-6 text-gray-600">
                {customer.notes}
              </p>
            </section>
          )}
        </div>

        <div className="border-t border-gray-200 bg-gray-50/60 px-6 py-4 text-right">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-[#111827] px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomerDetailsDialog;