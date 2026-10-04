
import { AlertTriangle, X } from "lucide-react";
import type { Supplier } from "@/types/supplier.types";

interface SupplierDeleteDialogProps {
  supplier: Supplier | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

function SupplierDeleteDialog({
  supplier,
  isDeleting,
  onClose,
  onConfirm,
}: SupplierDeleteDialogProps) {
  if (!supplier) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
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
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <h2 className="mt-5 text-lg font-bold text-gray-900">
          Delete supplier?
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          You are about to delete{" "}
          <span className="font-semibold text-gray-800">
            {supplier.name}
          </span>
          . This action will remove the supplier from the active
          supplier list.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => void onConfirm()}
            disabled={isDeleting}
            className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Delete Supplier"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SupplierDeleteDialog;