import {
  Download,
  ExternalLink,
  Printer,
  X,
} from "lucide-react";

import type { QRCode } from "@/types/qr.types";

interface QRPreviewDialogProps {
  qr: QRCode | null;
  onClose: () => void;
  onDownload: (qr: QRCode) => void;
  onPrint: (qr: QRCode) => void;
}

function QRPreviewDialog({
  qr,
  onClose,
  onDownload,
  onPrint,
}: QRPreviewDialogProps) {
  if (!qr) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[#FF6B35]">
              QR Management
            </p>

            <h2 className="mt-1 text-xl font-bold text-gray-900">
              Table {qr.tableNumber}
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

        <div className="mt-6 flex justify-center rounded-2xl border border-gray-200 bg-gray-50 p-6">
          {qr.qrImage ? (
            <img
              src={qr.qrImage}
              alt={`QR code for table ${qr.tableNumber}`}
              className="h-64 w-64 rounded-xl bg-white object-contain"
            />
          ) : (
            <div className="flex h-64 w-64 items-center justify-center text-sm text-gray-500">
              QR image unavailable
            </div>
          )}
        </div>

        <div className="mt-5 rounded-xl bg-gray-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Customer URL
          </p>

          <p className="mt-2 break-all text-sm text-gray-700">
            {qr.redirectUrl}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onDownload(qr)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-3 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
          >
            <Download className="h-4 w-4" />
            Save
          </button>

          <button
            type="button"
            onClick={() => onPrint(qr)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            <Printer className="h-4 w-4" />
            Print
          </button>

          <a
            href={qr.redirectUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            <ExternalLink className="h-4 w-4" />
            Open
          </a>
        </div>
      </div>
    </div>
  );
}

export default QRPreviewDialog;