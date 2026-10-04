import {
  Loader2,
  X,
} from "lucide-react";
import { useState } from "react";

import type { CreateQRData } from "@/types/qr.types";

interface QRGenerateDialogProps {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (data: CreateQRData) => Promise<void>;
}

function QRGenerateDialog({
  open,
  loading,
  onClose,
  onSubmit,
}: QRGenerateDialogProps) {
  const [form, setForm] =
    useState<CreateQRData>({
      restaurantId: "",
      branchId: "",
      floorId: "",
      tableId: "",
    });

  if (!open) {
    return null;
  }

  const updateField = (
    field: keyof CreateQRData,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    await onSubmit(form);

    setForm({
      restaurantId: "",
      branchId: "",
      floorId: "",
      tableId: "",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[#FF6B35]">
              QR Management
            </p>

            <h2 className="mt-1 text-xl font-bold text-gray-900">
              Generate Table QR
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-2 text-sm text-gray-500">
          Enter the hierarchy IDs for the table. The
          backend validates that they belong together.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
        >
          {(
            [
              ["restaurantId", "Restaurant ID"],
              ["branchId", "Branch ID"],
              ["floorId", "Floor ID"],
              ["tableId", "Table ID"],
            ] as const
          ).map(([field, label]) => (
            <div key={field}>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                {label}
              </label>

              <input
                required
                value={form[field]}
                onChange={(event) =>
                  updateField(
                    field,
                    event.target.value,
                  )
                }
                placeholder={`Enter ${label}`}
                className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-orange-100"
              />
            </div>
          ))}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#FF6B35] px-4 py-3 text-sm font-semibold text-white hover:bg-[#e85d2c] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              {loading
                ? "Generating..."
                : "Generate QR"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default QRGenerateDialog;