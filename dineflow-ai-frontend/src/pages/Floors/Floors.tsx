import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

import LoadingState from "@/components/common/LoadingState";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";

import FloorStats from "@/components/floors/FloorStats";
import FloorFilters from "@/components/floors/FloorFilters";
import FloorTable from "@/components/floors/FloorTable";
import FloorFormDialog from "@/components/floors/FloorFormDialog";
import DeleteFloorDialog from "@/components/floors/DeleteFloorDialog";

import type {
  Floor,
  CreateFloorData,
} from "@/types/floor.types";

import * as floorService from "@/services/floors/floor.service";

export default function Floors() {
  const navigate = useNavigate();

  const branchId =
    localStorage.getItem(
      "dineflow_selected_branch",
    ) || "";

  const restaurantId =
    localStorage.getItem(
      "dineflow_selected_restaurant",
    ) || "";

  const [floors, setFloors] =
    useState<Floor[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("ALL");

  const [formOpen, setFormOpen] =
    useState(false);

  const [editingFloor, setEditingFloor] =
    useState<Floor | null>(null);

  const [deleteFloor, setDeleteFloor] =
    useState<Floor | null>(null);

  const [actionLoading, setActionLoading] =
    useState(false);

  const loadFloors = async () => {
    try {
      setLoading(true);
      setError(null);

      const data =
        await floorService.getFloors(
          branchId || undefined,
        );

      setFloors(data);
    } catch {
      setError(
        "Unable to load floors.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadFloors();
  }, [branchId]);

  const filteredFloors = useMemo(() => {
    return floors.filter((floor) => {
      const searchValue =
        search.toLowerCase();

      const matchesSearch =
        floor.name
          .toLowerCase()
          .includes(searchValue) ||
        floor.code
          ?.toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        status === "ALL" ||
        floor.status === status;

      return Boolean(
        matchesSearch &&
        matchesStatus,
      );
    });
  }, [floors, search, status]);

  const handleCreate = () => {
    setEditingFloor(null);
    setFormOpen(true);
  };

  const handleEdit = (
    floor: Floor,
  ) => {
    setEditingFloor(floor);
    setFormOpen(true);
  };

  const handleSubmit = async (
    data: CreateFloorData,
  ) => {
    try {
      setActionLoading(true);

      if (editingFloor) {
        await floorService.updateFloor(
          editingFloor.id,
          data,
        );
      } else {
        await floorService.createFloor(
          data,
        );
      }

      setFormOpen(false);
      setEditingFloor(null);

      await loadFloors();
    } catch {
      setError(
        "Unable to save floor.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteFloor) return;

    try {
      setActionLoading(true);

      await floorService.deleteFloor(
        deleteFloor.id,
      );

      setDeleteFloor(null);

      await loadFloors();
    } catch {
      setError(
        "Unable to delete floor.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (
    floor: Floor,
  ) => {
    try {
      setActionLoading(true);

      await floorService.updateFloorStatus(
        floor.id,
        floor.status === "ACTIVE"
          ? "INACTIVE"
          : "ACTIVE",
      );

      await loadFloors();
    } catch {
      setError(
        "Unable to update floor status.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <LoadingState message="Loading floors..." />
    );
  }

  if (
    error &&
    floors.length === 0
  ) {
    return (
      <ErrorState
        message={error}
        onRetry={loadFloors}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Floors
          </h1>

          <p className="mt-1 text-muted-foreground">
            Organize your branch into floors
            and dining areas.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              void loadFloors()
            }
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>

          <Button
            type="button"
            onClick={handleCreate}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Floor
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <FloorStats floors={floors} />

      <div className="rounded-xl border bg-card p-4">
        <FloorFilters
          search={search}
          status={status}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
        />
      </div>

      {filteredFloors.length === 0 ? (
        <EmptyState
          title={
            floors.length === 0
              ? "No floors yet"
              : "No floors found"
          }
          description={
            floors.length === 0
              ? "Create your first floor for this branch."
              : "Try changing your search or filter."
          }
          action={
            floors.length === 0 ? (
              <Button
                type="button"
                onClick={handleCreate}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Floor
              </Button>
            ) : undefined
          }
        />
      ) : (
        <FloorTable
          floors={filteredFloors}
          onView={(floor) =>
            navigate(
              `/floors/${floor.id}`,
            )
          }
          onEdit={handleEdit}
          onDelete={setDeleteFloor}
          onToggleStatus={
            handleToggleStatus
          }
        />
      )}

      <FloorFormDialog
        open={formOpen}
        floor={editingFloor}
        restaurantId={restaurantId}
        branchId={branchId}
        loading={actionLoading}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
      />

      <DeleteFloorDialog
        open={Boolean(deleteFloor)}
        floor={deleteFloor}
        loading={actionLoading}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteFloor(null);
          }
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
}