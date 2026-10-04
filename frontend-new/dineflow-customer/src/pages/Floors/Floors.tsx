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
  useNavigate,
} from "react-router-dom";

import { Button } from "@/components/ui/button";

import LoadingState from "@/components/common/LoadingState";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";

import FloorStats from "@/components/floors/FloorStats";
import FloorFilters from "@/components/floors/FloorFilters";
import FloorTable from "@/components/floors/FloorTable";
import FloorFormDialog from "@/components/floors/FloorFormDialog";
import DeleteFloorDialog from "@/components/floors/DeleteFloorDialog";

import { useRestaurant } from "@/context/RestaurantContext";

import type {
  Floor,
  CreateFloorData,
} from "@/types/floor.types";

import * as floorService from "@/services/floors/floor.service";

const SELECTED_BRANCH_KEY =
  "dineflow_selected_branch";

const SELECTED_FLOOR_KEY =
  "dineflow_selected_floor";

export default function Floors() {
  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const { selectedRestaurantId } =
    useRestaurant();

  const restaurantId =
    selectedRestaurantId ?? "";

  /*
   * Prefer branchId from the URL.
   * Fall back to selected branch in localStorage.
   */
  const branchId =
    searchParams.get("branchId") ||
    localStorage.getItem(
      SELECTED_BRANCH_KEY,
    ) ||
    "";

  /*
   * Keep the URL-selected branch
   * synchronized with localStorage.
   */
  useEffect(() => {
    const urlBranchId =
      searchParams.get("branchId");

    if (
      urlBranchId &&
      urlBranchId !== "undefined"
    ) {
      localStorage.setItem(
        SELECTED_BRANCH_KEY,
        urlBranchId,
      );
    }
  }, [searchParams]);

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
    if (!branchId) {
      setFloors([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data =
        await floorService.getFloors(
          branchId,
        );

      setFloors(data);
    } catch (error) {
      console.error(
        "Failed to load floors:",
        error,
      );

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
  }, [
    floors,
    search,
    status,
  ]);

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

    try {
      setActionLoading(true);
      setError(null);

      if (editingFloor) {
        await floorService.updateFloor(
          editingFloor.id,
          data,
        );
      } else {
        await floorService.createFloor(
          {
            ...data,
            restaurantId,
            branchId,
          },
        );
      }

      setFormOpen(false);
      setEditingFloor(null);

      await loadFloors();
    } catch (error) {
      console.error(
        "Failed to save floor:",
        error,
      );

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
      setError(null);

      await floorService.deleteFloor(
        deleteFloor.id,
      );

      const selectedFloorId =
        localStorage.getItem(
          SELECTED_FLOOR_KEY,
        );

      if (
        selectedFloorId ===
        deleteFloor.id
      ) {
        localStorage.removeItem(
          SELECTED_FLOOR_KEY,
        );
      }

      setDeleteFloor(null);

      await loadFloors();
    } catch (error) {
      console.error(
        "Failed to delete floor:",
        error,
      );

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
      setError(null);

      await floorService.updateFloorStatus(
        floor.id,
        floor.status === "ACTIVE"
          ? "INACTIVE"
          : "ACTIVE",
      );

      await loadFloors();
    } catch (error) {
      console.error(
        "Failed to update floor status:",
        error,
      );

      setError(
        "Unable to update floor status.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  /*
   * Select floor and open Tables.
   */
  const handleView = (
    floor: Floor,
  ) => {
    if (
      !floor.id ||
      floor.id === "undefined"
    ) {
      console.error(
        "Floor ID is missing:",
        floor,
      );

      return;
    }

    localStorage.setItem(
      SELECTED_FLOOR_KEY,
      floor.id,
    );

    navigate(
      `/tables?floorId=${encodeURIComponent(
        floor.id,
      )}`,
    );
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
            disabled={!branchId}
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

      {!branchId ? (
        <EmptyState
          title="Select a branch"
          description="Choose a branch before managing its floors."
        />
      ) : (
        <>
          <FloorStats
            floors={floors}
          />

          <div className="rounded-xl border bg-card p-4">
            <FloorFilters
              search={search}
              status={status}
              onSearchChange={setSearch}
              onStatusChange={setStatus}
            />
          </div>

          {filteredFloors.length ===
          0 ? (
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
                    onClick={
                      handleCreate
                    }
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Floor
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <FloorTable
              floors={
                filteredFloors
              }
              onView={handleView}
              onEdit={handleEdit}
              onDelete={
                setDeleteFloor
              }
              onToggleStatus={
                handleToggleStatus
              }
            />
          )}

          <FloorFormDialog
            open={formOpen}
            floor={editingFloor}
            restaurantId={
              restaurantId
            }
            branchId={branchId}
            loading={actionLoading}
            onOpenChange={
              setFormOpen
            }
            onSubmit={
              handleSubmit
            }
          />

          <DeleteFloorDialog
            open={Boolean(
              deleteFloor,
            )}
            floor={deleteFloor}
            loading={actionLoading}
            onOpenChange={(
              open,
            ) => {
              if (!open) {
                setDeleteFloor(
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