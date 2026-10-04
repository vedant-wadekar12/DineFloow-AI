import { Loader2, Trash2, X } from "lucide-react";

import type { QRCode } from "@/types/qr.types";

interface DeleteQRDialogProps {
  qr: QRCode | null;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

function DeleteQRDialog({
  qr,
  loading,
  onClose,
  onConfirm,
}: DeleteQRDialogProps) {
  if (!qr) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50">
          <Trash2 className="h-5 w-5 text-red-600" />
        </div>

        <h2 className="mt-5 text-xl font-bold text-gray-900">
          Delete QR code?
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          This will deactivate and soft-delete the QR
          code for Table {qr.tableNumber}.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {loading && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}

            Delete
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="absolute"
          aria-label="Close"
        >
          <X className="sr-only" />
        </button>
      </div>
    </div>
  );
}

export default DeleteQRDialog;