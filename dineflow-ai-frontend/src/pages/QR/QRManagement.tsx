import {
  AlertCircle,
  Loader2,
  Plus,
  QrCode,
  RefreshCw,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import type {
  CreateQRData,
  QRCode,
} from "@/types/qr.types";

import * as qrService from "@/services/qr/qr.service";

import QRStats from "@/components/qr/QRStats";
import QRFilters from "@/components/qr/QRFilters";
import QRTable from "@/components/qr/QRTable";
import QRPreviewDialog from "@/components/qr/QRPreviewDialog";
import QRGenerateDialog from "@/components/qr/QRGenerateDialog";
import DeleteQRDialog from "@/components/qr/DeleteQRDialog";

function QRManagement() {
  const [qrs, setQRs] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] =
    useState(false);
  const [error, setError] = useState<string | null>(
    null,
  );

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<
    "ALL" | "ACTIVE" | "INACTIVE"
  >("ALL");

  const [previewQR, setPreviewQR] =
    useState<QRCode | null>(null);

  const [deleteQR, setDeleteQR] =
    useState<QRCode | null>(null);

  const [generateOpen, setGenerateOpen] =
    useState(false);

  const loadQRs = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await qrService.getAllQRs();

      setQRs(data);
    } catch {
      setError(
        "Unable to load QR codes. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadQRs();
  }, []);

  const filteredQRs = useMemo(() => {
    return qrs.filter((qr) => {
      const normalizedSearch =
        search.toLowerCase().trim();

      const matchesSearch =
        normalizedSearch.length === 0 ||
        qr.tableNumber
          .toLowerCase()
          .includes(normalizedSearch) ||
        qr.qrToken
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        status === "ALL" ||
        (status === "ACTIVE" && qr.isActive) ||
        (status === "INACTIVE" && !qr.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [qrs, search, status]);

  const activeCount = qrs.filter(
    (qr) => qr.isActive,
  ).length;

  const inactiveCount =
    qrs.length - activeCount;

  const downloadQR = (qr: QRCode) => {
    if (!qr.qrImage) {
      return;
    }

    const link = document.createElement("a");
    link.href = qr.qrImage;
    link.download = `table-${qr.tableNumber}-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printQR = (qr: QRCode) => {
    if (!qr.qrImage) {
      return;
    }

    const printWindow = window.open(
      "",
      "_blank",
      "width=700,height=800",
    );

    if (!printWindow) {
      return;
    }

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>Table ${qr.tableNumber} QR</title>
          <style>
            body {
              margin: 0;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              font-family: Arial, sans-serif;
            }

            .card {
              text-align: center;
            }

            img {
              width: 500px;
              max-width: 80vw;
            }

            h1 {
              margin-bottom: 24px;
            }
          </style>
        </head>

        <body>
          <div class="card">
            <h1>Table ${qr.tableNumber}</h1>
            <img src="${qr.qrImage}" alt="QR Code" />
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();

    printWindow.focus();

    printWindow.onafterprint = () => {
      printWindow.close();
    };

    setTimeout(() => {
      printWindow.print();
    }, 300);
  };

  const handleGenerate = async (
    data: CreateQRData,
  ) => {
    try {
      setActionLoading(true);
      setError(null);

      const created = await qrService.createQR(data);

      setQRs((current) => {
        const existing = current.find(
          (qr) => qr._id === created._id,
        );

        if (existing) {
          return current.map((qr) =>
            qr._id === created._id
              ? created
              : qr,
          );
        }

        return [created, ...current];
      });

      setGenerateOpen(false);
    } catch {
      setError(
        "Unable to generate the QR code. Check the IDs and try again.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleRegenerate = async (qr: QRCode) => {
    try {
      setActionLoading(true);
      setError(null);

      const updated =
        await qrService.regenerateQR(qr.tableId);

      setQRs((current) =>
        current.map((item) =>
          item._id === updated._id
            ? updated
            : item,
        ),
      );
    } catch {
      setError(
        "Unable to regenerate this QR code.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (
    qr: QRCode,
  ) => {
    try {
      setActionLoading(true);
      setError(null);

      const updated =
        await qrService.updateQRStatus(
          qr._id,
          {
            isActive: !qr.isActive,
          },
        );

      setQRs((current) =>
        current.map((item) =>
          item._id === updated._id
            ? updated
            : item,
        ),
      );
    } catch {
      setError(
        "Unable to update the QR status.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteQR) {
      return;
    }

    try {
      setActionLoading(true);
      setError(null);

      await qrService.deleteQR(deleteQR._id);

      setQRs((current) =>
        current.filter(
          (qr) => qr._id !== deleteQR._id,
        ),
      );

      setDeleteQR(null);
    } catch {
      setError(
        "Unable to delete this QR code.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-orange-50 p-3">
              <QrCode className="h-6 w-6 text-[#FF6B35]" />
            </div>

            <div>
              <p className="text-sm font-medium text-[#FF6B35]">
                Phase 13
              </p>

              <h1 className="text-2xl font-bold text-gray-900">
                QR Management
              </h1>
            </div>
          </div>

          <p className="mt-2 text-sm text-gray-500">
            Manage table QR codes and customer ordering
            links.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void loadQRs()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw
              className={[
                "h-4 w-4",
                loading
                  ? "animate-spin"
                  : "",
              ].join(" ")}
            />

            Refresh
          </button>

          <button
            type="button"
            onClick={() =>
              setGenerateOpen(true)
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6B35] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#e85d2c]"
          >
            <Plus className="h-4 w-4" />
            Generate QR
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

          <div>
            <p className="font-semibold text-red-800">
              Something went wrong
            </p>

            <p className="mt-1 text-sm text-red-700">
              {error}
            </p>
          </div>
        </div>
      )}

      <QRStats
        total={qrs.length}
        active={activeCount}
        inactive={inactiveCount}
        tablesWithQR={qrs.length}
      />

      <QRFilters
        search={search}
        status={status}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onClear={() => {
          setSearch("");
          setStatus("ALL");
        }}
      />

      {loading ? (
        <div className="flex min-h-72 items-center justify-center rounded-2xl border border-gray-200 bg-white">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <Loader2 className="h-5 w-5 animate-spin text-[#FF6B35]" />
            Loading QR codes...
          </div>
        </div>
      ) : (
        <QRTable
          qrs={filteredQRs}
          onPreview={setPreviewQR}
          onRegenerate={handleRegenerate}
          onToggleStatus={handleToggleStatus}
          onDelete={setDeleteQR}
          onDownload={downloadQR}
          onPrint={printQR}
        />
      )}

      {actionLoading && (
        <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white shadow-xl">
          <Loader2 className="h-4 w-4 animate-spin" />
          Updating...
        </div>
      )}

      <QRPreviewDialog
        qr={previewQR}
        onClose={() => setPreviewQR(null)}
        onDownload={downloadQR}
        onPrint={printQR}
      />

      <QRGenerateDialog
        open={generateOpen}
        loading={actionLoading}
        onClose={() => setGenerateOpen(false)}
        onSubmit={handleGenerate}
      />

      <DeleteQRDialog
        qr={deleteQR}
        loading={actionLoading}
        onClose={() => setDeleteQR(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default QRManagement;