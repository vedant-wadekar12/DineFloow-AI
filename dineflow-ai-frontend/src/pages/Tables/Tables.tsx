import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Plus,
  RefreshCw,
} from "lucide-react";

import {
  useSearchParams,
} from "react-router-dom";

import { Button } from "@/components/ui/button";

import LoadingState from "@/components/common/LoadingState";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";

import TableStats from "@/components/tables/TableStats";
import TableFilters from "@/components/tables/TableFilters";
import RestaurantTable from "@/components/tables/RestaurantTable";
import TableFormDialog from "@/components/tables/TableFormDialog";
import DeleteTableDialog from "@/components/tables/DeleteTableDialog";

import type {
  RestaurantTable as RestaurantTableType,
  CreateTableData,
} from "@/types/table.types";

import * as tableService from "@/services/tables/table.service";

export default function Tables() {
  const [searchParams] =
    useSearchParams();

  const floorId =
    searchParams.get(
      "floorId",
    ) ||
    localStorage.getItem(
      "dineflow_selected_floor",
    ) ||
    "";

  const branchId =
    localStorage.getItem(
      "dineflow_selected_branch",
    ) || "";

  const restaurantId =
    localStorage.getItem(
      "dineflow_selected_restaurant",
    ) || "";

  const [tables, setTables] =
    useState<RestaurantTableType[]>(
      [],
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("ALL");

  const [type, setType] =
    useState("ALL");

  const [formOpen, setFormOpen] =
    useState(false);

  const [editingTable, setEditingTable] =
    useState<RestaurantTableType | null>(
      null,
    );

  const [deleteTable, setDeleteTable] =
    useState<RestaurantTableType | null>(
      null,
    );

  const [actionLoading, setActionLoading] =
    useState(false);

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
    } catch {
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

  const filteredTables = useMemo(() => {
    return tables.filter((table) => {
      const searchValue =
        search.toLowerCase();

      const matchesSearch =
        table.name
          .toLowerCase()
          .includes(searchValue) ||
        table.tableNumber
          ?.toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        status === "ALL" ||
        table.status === status;

      const matchesType =
        type === "ALL" ||
        table.type === type;

      return Boolean(
        matchesSearch &&
        matchesStatus &&
        matchesType,
      );
    });
  }, [
    tables,
    search,
    status,
    type,
  ]);

  const handleSubmit = async (
    data: CreateTableData,
  ) => {
    try {
      setActionLoading(true);

      if (editingTable) {
        await tableService.updateTable(
          editingTable.id,
          data,
        );
      } else {
        await tableService.createTable(
          data,
        );
      }

      setFormOpen(false);
      setEditingTable(null);

      await loadTables();
    } catch {
      setError(
        "Unable to save table.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTable) return;

    try {
      setActionLoading(true);

      await tableService.deleteTable(
        deleteTable.id,
      );

      setDeleteTable(null);

      await loadTables();
    } catch {
      setError(
        "Unable to delete table.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <LoadingState message="Loading tables..." />
    );
  }

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
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>

          <Button
            type="button"
            onClick={() => {
              setEditingTable(null);
              setFormOpen(true);
            }}
            disabled={!floorId}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Table
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {!floorId ? (
        <EmptyState
          title="Select a floor"
          description="Choose a floor before managing its tables."
        />
      ) : (
        <>
          <TableStats
            tables={tables}
          />

          <div className="rounded-xl border bg-card p-4">
            <TableFilters
              search={search}
              status={status}
              type={type}
              onSearchChange={setSearch}
              onStatusChange={setStatus}
              onTypeChange={setType}
            />
          </div>

          {filteredTables.length ===
          0 ? (
            <EmptyState
              title={
                tables.length === 0
                  ? "No tables yet"
                  : "No tables found"
              }
              description={
                tables.length === 0
                  ? "Create the first table for this floor."
                  : "Try changing your filters."
              }
              action={
                tables.length === 0 ? (
                  <Button
                    type="button"
                    onClick={() =>
                      setFormOpen(true)
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
              onView={(table) =>
                console.log(
                  "View table",
                  table.id,
                )
              }
              onEdit={(table) => {
                setEditingTable(
                  table,
                );
                setFormOpen(true);
              }}
              onDelete={
                setDeleteTable
              }
            />
          )}

          <TableFormDialog
            open={formOpen}
            table={editingTable}
            restaurantId={
              restaurantId
            }
            branchId={branchId}
            floorId={floorId}
            loading={actionLoading}
            onOpenChange={
              setFormOpen
            }
            onSubmit={
              handleSubmit
            }
          />

          <DeleteTableDialog
            open={Boolean(
              deleteTable,
            )}
            table={deleteTable}
            loading={actionLoading}
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
        </>
      )}
    </div>
  );
}