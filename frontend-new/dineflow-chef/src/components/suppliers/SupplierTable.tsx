import {
  Eye,
  MoreHorizontal,
  Pencil,
  Power,
  Trash2,
} from "lucide-react";

import type { Supplier } from "@/types/supplier.types";

interface SupplierTableProps {
  suppliers: Supplier[];
  onView: (supplier: Supplier) => void;
  onEdit: (supplier: Supplier) => void;
  onStatusChange: (supplier: Supplier) => void;
  onDelete: (supplier: Supplier) => void;
}

function SupplierTable({
  suppliers,
  onView,
  onEdit,
  onStatusChange,
  onDelete,
}: SupplierTableProps) {
  return (
    <>
      {/* Desktop */}
      <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px]">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Supplier
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Contact
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Location
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  GST
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {suppliers.map((supplier) => (
                <tr
                  key={supplier.id}
                  className="transition hover:bg-gray-50"
                >
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-900">
                      {supplier.name}
                    </p>

                    {supplier.companyName && (
                      <p className="mt-1 text-xs text-gray-500">
                        {supplier.companyName}
                      </p>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm text-gray-700">
                      {supplier.phone}
                    </p>

                    {supplier.email && (
                      <p className="mt-1 text-xs text-gray-500">
                        {supplier.email}
                      </p>
                    )}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {[supplier.city, supplier.state]
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {supplier.gstNumber || "—"}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        supplier.isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {supplier.isActive
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onView(supplier)}
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEdit(supplier)}
                        className="rounded-lg p-2 text-gray-500 hover:bg-orange-50 hover:text-[#FF6B35]"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onStatusChange(supplier)
                        }
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                        title={
                          supplier.isActive
                            ? "Deactivate"
                            : "Activate"
                        }
                      >
                        <Power className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(supplier)}
                        className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile */}
      <div className="space-y-3 md:hidden">
        {suppliers.map((supplier) => (
          <div
            key={supplier.id}
            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-gray-900">
                  {supplier.name}
                </p>

                {supplier.companyName && (
                  <p className="mt-1 text-xs text-gray-500">
                    {supplier.companyName}
                  </p>
                )}
              </div>

              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  supplier.isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {supplier.isActive
                  ? "Active"
                  : "Inactive"}
              </span>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <p className="text-gray-600">
                <span className="font-medium text-gray-800">
                  Phone:
                </span>{" "}
                {supplier.phone}
              </p>

              {supplier.email && (
                <p className="break-all text-gray-600">
                  <span className="font-medium text-gray-800">
                    Email:
                  </span>{" "}
                  {supplier.email}
                </p>
              )}

              <p className="text-gray-600">
                <span className="font-medium text-gray-800">
                  Location:
                </span>{" "}
                {[supplier.city, supplier.state]
                  .filter(Boolean)
                  .join(", ") || "—"}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-end gap-1 border-t border-gray-100 pt-3">
              <button
                type="button"
                onClick={() => onView(supplier)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <Eye className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => onEdit(supplier)}
                className="rounded-lg p-2 text-gray-500 hover:bg-orange-50 hover:text-[#FF6B35]"
              >
                <Pencil className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => onStatusChange(supplier)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <Power className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => onDelete(supplier)}
                className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              <MoreHorizontal className="ml-1 h-4 w-4 text-gray-300" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default SupplierTable;