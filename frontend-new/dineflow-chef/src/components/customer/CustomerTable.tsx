import {
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import CustomerStatusBadge from "./CustomerStatusBadge";

import type {
  Customer,
} from "@/types/customer.types";

interface CustomerTableProps {
  customers: Customer[];
  onView: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
  onStatusChange: (
    customer: Customer,
  ) => void;
}

function CustomerTable({
  customers,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
}: CustomerTableProps) {
  if (customers.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50">
          <Eye className="h-6 w-6 text-[#FF6B35]" />
        </div>

        <h3 className="mt-4 text-base font-semibold text-gray-900">
          No customers found
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Try changing your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px]">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/70">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Customer
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Contact
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Orders
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Spent
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Status
              </th>

              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {customers.map((customer) => {
              const initials =
                `${customer.firstName.charAt(0)}${customer.lastName?.charAt(0) ?? ""}`.toUpperCase();

              return (
                <tr
                  key={customer._id}
                  className="transition hover:bg-gray-50/70"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {customer.profileImage ? (
                        <img
                          src={
                            customer.profileImage
                          }
                          alt={`${customer.firstName} ${customer.lastName ?? ""}`}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-[#FF6B35]">
                          {initials}
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {customer.firstName}{" "}
                          {customer.lastName ?? ""}
                        </p>

                        <p className="text-xs text-gray-500">
                          Joined{" "}
                          {new Date(
                            customer.createdAt,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm text-gray-800">
                      {customer.phone}
                    </p>

                    <p className="max-w-[220px] truncate text-xs text-gray-500">
                      {customer.email ??
                        "No email"}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm font-medium text-gray-800">
                    {customer.totalOrders}
                  </td>

                  <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                    ₹
                    {customer.totalSpent.toLocaleString(
                      "en-IN",
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <CustomerStatusBadge
                      status={customer.status}
                    />
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        title="View customer"
                        onClick={() =>
                          onView(customer)
                        }
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        title="Edit customer"
                        onClick={() =>
                          onEdit(customer)
                        }
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-orange-50 hover:text-[#FF6B35]"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        title="Change status"
                        onClick={() =>
                          onStatusChange(customer)
                        }
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        title="Delete customer"
                        onClick={() =>
                          onDelete(customer)
                        }
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CustomerTable;