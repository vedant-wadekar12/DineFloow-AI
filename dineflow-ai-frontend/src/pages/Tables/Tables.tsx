import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertCircle,
  Loader2,
  Plus,
  RefreshCw,
} from "lucide-react";

import {
  useSearchParams,
} from "react-router-dom";

import axios from "axios";

import { Button } from "@/components/ui/button";

import LoadingState from "@/components/common/LoadingState";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";

import TableStats from "@/components/tables/TableStats";
import TableFilters from "@/components/tables/TableFilters";
import RestaurantTable from "@/components/tables/RestaurantTable";
import TableFormDialog from "@/components/tables/TableFormDialog";
import DeleteTableDialog from "@/components/tables/DeleteTableDialog";
import TableViewDialog from "@/components/tables/TableViewDialog";

import QRPreviewDialog from "@/components/qr/QRPreviewDialog";

import { useRestaurant } from "@/context/RestaurantContext";

import type {
  RestaurantTable as RestaurantTableType,
  CreateTableData,
} from "@/types/table.types";

import type {
  QRCode,
} from "@/types/qr.types";

import * as tableService from "@/services/tables/table.service";
import * as branchService from "@/services/branches/branch.service";
import * as qrService from "@/services/qr/qr.service";

const SELECTED_BRANCH_KEY =
  "dineflow_selected_branch";

const SELECTED_FLOOR_KEY =
  "dineflow_selected_floor";

export default function Tables() {
  const [searchParams] =
    useSearchParams();

  const { selectedRestaurantId } =
    useRestaurant();

  const restaurantId =
    selectedRestaurantId ?? "";

  /*
   * Floor selected from URL.
   * Falls back to localStorage.
   */
  const urlFloorId =
    searchParams.get("floorId");

  const floorId =
    urlFloorId &&
    urlFloorId !== "undefined"
      ? urlFloorId
      : localStorage.getItem(
          SELECTED_FLOOR_KEY,
        ) || "";

  /*
   * Keep URL floor synchronized
   * with localStorage.
   */
  useEffect(() => {
    if (
      urlFloorId &&
      urlFloorId !== "undefined"
    ) {
      localStorage.setItem(
        SELECTED_FLOOR_KEY,
        urlFloorId,
      );
    }
  }, [urlFloorId]);

  /*
   * Selected branch.
   */
  const [
    branchId,
    setBranchId,
  ] = useState(
    () =>
      localStorage.getItem(
        SELECTED_BRANCH_KEY,
      ) || "",
  );

  const [
    tables,
    setTables,
  ] = useState<RestaurantTableType[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    status,
    setStatus,
  ] = useState("ALL");

  const [
    type,
    setType,
  ] = useState("ALL");

  const [
    formOpen,
    setFormOpen,
  ] = useState(false);

  const [
    editingTable,
    setEditingTable,
  ] = useState<RestaurantTableType | null>(
    null,
  );

  const [
    viewingTable,
    setViewingTable,
  ] = useState<RestaurantTableType | null>(
    null,
  );

  const [
    deleteTable,
    setDeleteTable,
  ] = useState<RestaurantTableType | null>(
    null,
  );

  const [
    previewQR,
    setPreviewQR,
  ] = useState<QRCode | null>(null);

  const [
    actionLoading,
    setActionLoading,
  ] = useState(false);

  /*
   * Validate that the selected branch
   * belongs to the selected restaurant.
   */
  useEffect(() => {
    const validateBranch =
      async () => {
        if (!restaurantId) {
          setBranchId("");

          localStorage.removeItem(
            SELECTED_BRANCH_KEY,
          );

          localStorage.removeItem(
            SELECTED_FLOOR_KEY,
          );

          setTables([]);

          return;
        }

        if (!branchId) {
          setTables([]);
          return;
        }

        try {
          const branches =
            await branchService.getBranches(
              restaurantId,
            );

          const validBranch =
            branches.find(
              (branch) =>
                String(branch.id) ===
                String(branchId),
            );

          if (!validBranch) {
            setBranchId("");

            localStorage.removeItem(
              SELECTED_BRANCH_KEY,
            );

            localStorage.removeItem(
              SELECTED_FLOOR_KEY,
            );

            setTables([]);

            setError(
              "The selected branch does not belong to this restaurant. Please select a branch.",
            );

            return;
          }

          /*
           * Branch is valid.
           */
          setError(null);
        } catch (error) {
          console.error(
            "Failed to validate branch:",
            error,
          );

          setError(
            "Unable to validate the selected branch.",
          );
        }
      };

    void validateBranch();
  }, [
    restaurantId,
    branchId,
  ]);

  /*
   * Load tables for selected floor.
   */
  const loadTables = async () => {
    if (!floorId) {
      setTables([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data =
        await tableService.getTables(
          floorId,
        );

      setTables(data);
    } catch (error) {
      console.error(
        "Failed to load tables:",
        error,
      );

      setError(
        "Unable to load tables.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadTables();
  }, [floorId]);

  /*
   * Filter tables.
   */
  const filteredTables =
    useMemo(() => {
      return tables.filter(
        (table) => {
          const searchValue =
            search
              .toLowerCase()
              .trim();

          const tableName =
            table.name
              ?.toLowerCase() ?? "";

          const tableNumber =
            table.tableNumber
              ?.toString() ?? "";

          const matchesSearch =
            tableName.includes(
              searchValue,
            ) ||
            tableNumber.includes(
              searchValue,
            );

          const matchesStatus =
            status === "ALL" ||
            table.status === status;

          const matchesType =
            type === "ALL" ||
            table.type === type;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesType
          );
        },
      );
    }, [
      tables,
      search,
      status,
      type,
    ]);

  /*
   * Open Add Table dialog.
   */
  const handleCreate = () => {
    if (!restaurantId) {
      setError(
        "Please select a restaurant first.",
      );
      return;
    }

    if (!branchId) {
      setError(
        "Please select a branch first.",
      );
      return;
    }

    if (!floorId) {
      setError(
        "Please select a floor first.",
      );
      return;
    }

    setError(null);
    setEditingTable(null);
    setFormOpen(true);
  };

  /*
   * Create or update table.
   */
  const handleSubmit = async (
    data: CreateTableData,
  ) => {
    if (!restaurantId) {
      setError(
        "Please select a restaurant first.",
      );
      return;
    }

    if (!branchId) {
      setError(
        "Please select a branch first.",
      );
      return;
    }

    if (!floorId) {
      setError(
        "Please select a floor first.",
      );
      return;
    }

    try {
      setActionLoading(true);
      setError(null);

      /*
       * Get latest tables before saving.
       * This prevents stale duplicate checks.
       */
      const latestTables =
        await tableService.getTables(
          floorId,
        );

      /*
       * Check duplicate table number.
       */
      const duplicateTable =
        latestTables.find(
          (table) =>
            Number(
              table.tableNumber,
            ) ===
              Number(
                data.tableNumber,
              ) &&
            String(table.id) !==
              String(
                editingTable?.id,
              ),
        );

      if (duplicateTable) {
        setError(
          `Table number ${data.tableNumber} already exists on this floor. Please choose another table number.`,
        );

        setTables(latestTables);

        return;
      }

      /*
       * Update existing table.
       */
      if (editingTable) {
        await tableService.updateTable(
          editingTable.id,
          data,
        );
      } else {
        /*
         * Create new table.
         */
        await tableService.createTable(
          {
            ...data,
            restaurantId,
            branchId,
            floorId,
          },
        );
      }

      setFormOpen(false);
      setEditingTable(null);

      await loadTables();
    } catch (error) {
      console.error(
        "Failed to save table:",
        error,
      );

      if (
        axios.isAxiosError(error)
      ) {
        const backendMessage =
          error.response?.data
            ?.message;

        if (
          typeof backendMessage ===
          "string"
        ) {
          setError(
            backendMessage,
          );

          return;
        }
      }

      setError(
        "Unable to save table. Please try again.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  /*
   * Generate QR automatically.
   *
   * User does NOT enter:
   * - Restaurant ID
   * - Branch ID
   * - Floor ID
   * - Table ID
   *
   * These are already known here.
   */
  const handleGenerateQR =
    async (
      table: RestaurantTableType,
    ) => {
      if (!restaurantId) {
        setError(
          "Please select a restaurant first.",
        );
        return;
      }

      if (!branchId) {
        setError(
          "Please select a branch first.",
        );
        return;
      }

      if (!floorId) {
        setError(
          "Please select a floor first.",
        );
        return;
      }

      if (!table.id) {
        setError(
          "Unable to generate QR because the table ID is missing.",
        );
        return;
      }

      try {
        setActionLoading(true);
        setError(null);

        const qr =
          await qrService.createQR(
            {
              restaurantId,
              branchId,
              floorId,
              tableId: table.id,
            },
          );

        setPreviewQR(qr);

        await loadTables();
      } catch (error) {
        console.error(
          "Failed to generate QR:",
          error,
        );

        if (
          axios.isAxiosError(error)
        ) {
          const backendMessage =
            error.response?.data
              ?.message;

          if (
            typeof backendMessage ===
            "string"
          ) {
            setError(
              backendMessage,
            );

            return;
          }
        }

        setError(
          "Unable to generate QR code. Please try again.",
        );
      } finally {
        setActionLoading(false);
      }
    };

  /*
   * Download QR image.
   */
  const downloadQR = (
    qr: QRCode,
  ) => {
    if (!qr.qrImage) {
      setError(
        "QR image is not available.",
      );
      return;
    }

    const link =
      document.createElement(
        "a",
      );

    link.href = qr.qrImage;

    link.download =
      `table-${qr.tableNumber}-qr.png`;

    document.body.appendChild(
      link,
    );

    link.click();

    document.body.removeChild(
      link,
    );
  };

  /*
   * Print QR.
   */
  const printQR = (
    qr: QRCode,
  ) => {
    if (!qr.qrImage) {
      setError(
        "QR image is not available.",
      );
      return;
    }

    const printWindow =
      window.open(
        "",
        "_blank",
        "width=700,height=800",
      );

    if (!printWindow) {
      setError(
        "Please allow pop-ups to print the QR code.",
      );
      return;
    }

    printWindow.document.write(
      `
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

            p {
              margin-top: 16px;
              color: #666;
            }
          </style>
        </head>

        <body>
          <div class="card">
            <h1>
              Table ${qr.tableNumber}
            </h1>

            <img
              src="${qr.qrImage}"
              alt="QR Code for Table ${qr.tableNumber}"
            />

            <p>
              Scan to order
            </p>
          </div>
        </body>
      </html>
      `,
    );

    printWindow.document.close();

    printWindow.focus();

    printWindow.onafterprint =
      () => {
        printWindow.close();
      };

    setTimeout(() => {
      printWindow.print();
    }, 300);
  };

  /*
   * Delete table.
   */
  const handleDelete =
    async () => {
      if (!deleteTable) {
        return;
      }

      try {
        setActionLoading(true);
        setError(null);

        await tableService.deleteTable(
          deleteTable.id,
        );

        setDeleteTable(null);

        await loadTables();
      } catch (error) {
        console.error(
          "Failed to delete table:",
          error,
        );

        if (
          axios.isAxiosError(error)
        ) {
          const backendMessage =
            error.response?.data
              ?.message;

          if (
            typeof backendMessage ===
            "string"
          ) {
            setError(
              backendMessage,
            );

            return;
          }
        }

        setError(
          "Unable to delete table.",
        );
      } finally {
        setActionLoading(false);
      }
    };

  /*
   * Initial loading.
   */
  if (loading) {
    return (
      <LoadingState
        message="Loading tables..."
      />
    );
  }

  /*
   * Initial error.
   */
  if (
    error &&
    tables.length === 0
  ) {
    return (
      <ErrorState
        message={error}
        onRetry={loadTables}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Tables
          </h1>

          <p className="mt-1 text-muted-foreground">
            Manage tables, seating capacity,
            and table status.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              void loadTables()
            }
            disabled={
              loading ||
              actionLoading
            }
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>

          <Button
            type="button"
            onClick={handleCreate}
            disabled={
              !restaurantId ||
              !branchId ||
              !floorId ||
              actionLoading
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Table
          </Button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

          <span>{error}</span>
        </div>
      )}

      {/* No floor */}
      {!floorId ? (
        <EmptyState
          title="Select a floor"
          description="Choose a floor before managing its tables."
        />
      ) : (
        <>
          {/* Statistics */}
          <TableStats
            tables={tables}
          />

          {/* Filters */}
          <div className="rounded-xl border bg-card p-4">
            <TableFilters
              search={search}
              status={status}
              type={type}
              onSearchChange={
                setSearch
              }
              onStatusChange={
                setStatus
              }
              onTypeChange={
                setType
              }
            />
          </div>

          {/* Table list */}
          {filteredTables.length ===
          0 ? (
            <EmptyState
              title={
                tables.length ===
                0
                  ? "No tables yet"
                  : "No tables found"
              }
              description={
                tables.length ===
                0
                  ? "Create the first table for this floor."
                  : "Try changing your filters."
              }
              action={
                tables.length ===
                0 ? (
                  <Button
                    type="button"
                    onClick={
                      handleCreate
                    }
                    disabled={
                      actionLoading
                    }
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Table
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <RestaurantTable
              tables={
                filteredTables
              }
              onView={(table) => {
                setViewingTable(
                  table,
                );
              }}
              onEdit={(table) => {
                setError(null);

                setEditingTable(
                  table,
                );

                setFormOpen(
                  true,
                );
              }}
              onDelete={(table) => {
                setError(null);

                setDeleteTable(
                  table,
                );
              }}
              onGenerateQR={
                handleGenerateQR
              }
              actionLoading={
                actionLoading
              }
            />
          )}

          {/* Add / Edit */}
          <TableFormDialog
            open={formOpen}
            table={editingTable}
            restaurantId={
              restaurantId
            }
            branchId={branchId}
            floorId={floorId}
            loading={
              actionLoading
            }
            onOpenChange={(
              open,
            ) => {
              setFormOpen(open);

              if (!open) {
                setEditingTable(
                  null,
                );
              }
            }}
            onSubmit={
              handleSubmit
            }
          />

          {/* View */}
          <TableViewDialog
            open={Boolean(
              viewingTable,
            )}
            table={viewingTable}
            onOpenChange={(
              open,
            ) => {
              if (!open) {
                setViewingTable(
                  null,
                );
              }
            }}
          />

          {/* Delete */}
          <DeleteTableDialog
            open={Boolean(
              deleteTable,
            )}
            table={deleteTable}
            loading={
              actionLoading
            }
            onOpenChange={(
              open,
            ) => {
              if (!open) {
                setDeleteTable(
                  null,
                );
              }
            }}
            onConfirm={
              handleDelete
            }
          />

          {/* QR Preview */}
          <QRPreviewDialog
            qr={previewQR}
            onClose={() =>
              setPreviewQR(null)
            }
            onDownload={
              downloadQR
            }
            onPrint={
              printQR
            }
          />
        </>
      )}

      {/* Action loading */}
      {actionLoading && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white shadow-xl">
          <Loader2 className="h-4 w-4 animate-spin" />
          Processing...
        </div>
      )}
    </div>
  );
}