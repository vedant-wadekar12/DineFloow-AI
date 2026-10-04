import { AlertTriangle, X } from "lucide-react";

import type {
  Customer,
} from "@/types/customer.types";

interface DeleteCustomerDialogProps {
  customer: Customer | null;
  open: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

function DeleteCustomerDialog({
  customer,
  open,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteCustomerDialogProps) {
  if (!open || !customer) {
    return null;
  }

  const name =
    `${customer.firstName} ${customer.lastName ?? ""}`.trim();

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <h2 className="mt-5 text-lg font-bold text-gray-900">
          Delete customer?
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          This will remove{" "}
          <span className="font-semibold text-gray-800">
            {name}
          </span>{" "}
          from the active customer list. This action uses
          the backend's soft-delete operation.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => void onConfirm()}
            disabled={isDeleting}
            className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {isDeleting
              ? "Deleting..."
              : "Delete Customer"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteCustomerDialog;