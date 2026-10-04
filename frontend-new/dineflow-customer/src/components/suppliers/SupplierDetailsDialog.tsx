import { X } from "lucide-react";
import type { Supplier } from "@/types/supplier.types";

interface SupplierDetailsDialogProps {
  supplier: Supplier | null;
  onClose: () => void;
}

function SupplierDetailsDialog({
  supplier,
  onClose,
}: SupplierDetailsDialogProps) {
  if (!supplier) return null;

  const rows = [
    ["Supplier Name", supplier.name],
    ["Company", supplier.companyName],
    ["Phone", supplier.phone],
    ["Email", supplier.email],
    ["Contact Person", supplier.contactPerson],
    ["GST Number", supplier.gstNumber],
    ["Address", supplier.address],
    ["City", supplier.city],
    ["State", supplier.state],
    ["Pincode", supplier.pincode],
    ["Branch ID", supplier.branchId],
    ["Notes", supplier.notes],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-[#111827]">
              Supplier Details
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Complete supplier information.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-6">
          <div className="mb-6 flex items-center justify-between rounded-xl bg-[#FFF7F2] p-4">
            <div>
              <p className="text-lg font-bold text-[#111827]">
                {supplier.name}
              </p>

              {supplier.companyName && (
                <p className="mt-1 text-sm text-gray-500">
                  {supplier.companyName}
                </p>
              )}
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                supplier.isActive
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {supplier.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
            {rows.map(([label, value]) => (
              <div
                key={label}
                className="border-b border-gray-100 pb-3"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {label}
                </p>

                <p className="mt-1 break-words text-sm text-gray-800">
                  {value || "—"}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 px-6 py-4 text-right">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default SupplierDetailsDialog;