import {
  Download,
  Eye,
  MoreHorizontal,
  Printer,
  RefreshCw,
  Trash2,
} from "lucide-react";

import type { QRCode } from "@/types/qr.types";

import QRStatusBadge from "./QRStatusBadge";

interface QRTableProps {
  qrs: QRCode[];
  onPreview: (qr: QRCode) => void;
  onRegenerate: (qr: QRCode) => void;
  onToggleStatus: (qr: QRCode) => void;
  onDelete: (qr: QRCode) => void;
  onDownload: (qr: QRCode) => void;
  onPrint: (qr: QRCode) => void;
}

function QRTable({
  qrs,
  onPreview,
  onRegenerate,
  onToggleStatus,
  onDelete,
  onDownload,
  onPrint,
}: QRTableProps) {
  if (qrs.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50">
          <Eye className="h-6 w-6 text-[#FF6B35]" />
        </div>

        <h3 className="mt-4 font-semibold text-gray-900">
          No QR codes found
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Generate a QR code for one of your restaurant
          tables.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-left">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Table
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Type
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Customer URL
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Status
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {qrs.map((qr) => (
              <tr
                key={qr._id}
                className="transition hover:bg-orange-50/30"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    {qr.qrImage ? (
                      <img
                        src={qr.qrImage}
                        alt={`QR for table ${qr.tableNumber}`}
                        className="h-12 w-12 rounded-lg border border-gray-200"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-gray-100" />
                    )}

                    <div>
                      <p className="font-semibold text-gray-900">
                        Table {qr.tableNumber}
                      </p>

                      <p className="text-xs text-gray-500">
                        {qr._id}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4 text-sm text-gray-600">
                  {qr.type}
                </td>

                <td className="max-w-[280px] px-5 py-4">
                  <p className="truncate text-sm text-gray-600">
                    {qr.redirectUrl}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <QRStatusBadge
                    isActive={qr.isActive}
                  />
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      title="Preview"
                      onClick={() => onPreview(qr)}
                      className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      title="Download"
                      onClick={() => onDownload(qr)}
                      className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    >
                      <Download className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      title="Print"
                      onClick={() => onPrint(qr)}
                      className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    >
                      <Printer className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      title="Regenerate"
                      onClick={() => onRegenerate(qr)}
                      className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      title={
                        qr.isActive
                          ? "Deactivate"
                          : "Activate"
                      }
                      onClick={() =>
                        onToggleStatus(qr)
                      }
                      className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      title="Delete"
                      onClick={() => onDelete(qr)}
                      className="rounded-lg p-2 text-red-500 hover:bg-red-50"
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
  );
}

export default QRTable;