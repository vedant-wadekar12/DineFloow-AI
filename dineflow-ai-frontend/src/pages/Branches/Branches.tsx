import { useEffect, useMemo, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

import LoadingState from "@/components/common/LoadingState";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";

import BranchStats from "@/components/branches/BranchStats";
import BranchFilters from "@/components/branches/BranchFilters";
import BranchTable from "@/components/branches/BranchTable";
import BranchFormDialog from "@/components/branches/BranchFormDialog";
import DeleteBranchDialog from "@/components/branches/DeleteBranchDialog";

import type {
  Branch,
  CreateBranchData,
} from "@/types/branch.types";

import * as branchService from "@/services/branches/branch.service";

export default function Branches() {
  const navigate = useNavigate();

  /*
   * Replace this with the currently selected
   * restaurant from your restaurant context/
   * selector when available.
   */
  const restaurantId =
    localStorage.getItem(
      "dineflow_selected_restaurant",
    ) || "";

  const [branches, setBranches] =
    useState<Branch[]>([]);

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

  const [editingBranch, setEditingBranch] =
    useState<Branch | null>(null);

  const [deleteBranch, setDeleteBranch] =
    useState<Branch | null>(null);

  const [actionLoading, setActionLoading] =
    useState(false);

  const loadBranches = async () => {
    try {
      setLoading(true);
      setError(null);

      const data =
        await branchService.getBranches(
          restaurantId || undefined,
        );

      setBranches(data);
    } catch {
      setError(
        "Unable to load branches. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadBranches();
  }, [restaurantId]);

  const filteredBranches = useMemo(() => {
    return branches.filter((branch) => {
      const searchValue =
        search.toLowerCase();

      const matchesSearch =
        branch.name
          .toLowerCase()
          .includes(searchValue) ||
        branch.code
          ?.toLowerCase()
          .includes(searchValue) ||
        branch.address.city
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        status === "ALL" ||
        branch.status === status;

      return Boolean(
        matchesSearch && matchesStatus,
      );
    });
  }, [branches, search, status]);

  const handleCreate = () => {
    setEditingBranch(null);
    setFormOpen(true);
  };

  const handleEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setFormOpen(true);
  };

  const handleSubmit = async (
    data: CreateBranchData,
  ) => {
    try {
      setActionLoading(true);

      if (editingBranch) {
        await branchService.updateBranch(
          editingBranch.id,
          data,
        );
      } else {
        await branchService.createBranch(
          data,
        );
      }

      setFormOpen(false);
      setEditingBranch(null);

      await loadBranches();
    } catch {
      setError(
        "Unable to save the branch. Please try again.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteBranch) return;

    try {
      setActionLoading(true);

      await branchService.deleteBranch(
        deleteBranch.id,
      );

      setDeleteBranch(null);

      await loadBranches();
    } catch {
      setError(
        "Unable to delete the branch.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (
    branch: Branch,
  ) => {
    try {
      setActionLoading(true);

      await branchService.updateBranchStatus(
        branch.id,
        branch.status === "ACTIVE"
          ? "INACTIVE"
          : "ACTIVE",
      );

      await loadBranches();
    } catch {
      setError(
        "Unable to update branch status.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <LoadingState message="Loading branches..." />
    );
  }

  if (error && branches.length === 0) {
    return (
      <ErrorState
        message={error}
        onRetry={loadBranches}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Branches
          </h1>

          <p className="mt-1 text-muted-foreground">
            Manage all branches of your restaurant.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => void loadBranches()}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>

          <Button
            type="button"
            onClick={handleCreate}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Branch
          </Button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Stats */}
      <BranchStats branches={branches} />

      {/* Filters */}
      <div className="rounded-xl border bg-card p-4">
        <BranchFilters
          search={search}
          status={status}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
        />
      </div>

      {/* Content */}
      {filteredBranches.length === 0 ? (
        <EmptyState
          title={
            branches.length === 0
              ? "No branches yet"
              : "No branches found"
          }
          description={
            branches.length === 0
              ? "Create your first branch to start managing your restaurant locations."
              : "Try changing your search or status filter."
          }
          action={
            branches.length === 0 ? (
              <Button
                type="button"
                onClick={handleCreate}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Branch
              </Button>
            ) : undefined
          }
        />
      ) : (
        <BranchTable
          branches={filteredBranches}
          onView={(branch) =>
            navigate(`/branches/${branch.id}`)
          }
          onEdit={handleEdit}
          onDelete={setDeleteBranch}
          onToggleStatus={
            handleToggleStatus
          }
        />
      )}

      {/* Create / Edit */}
      <BranchFormDialog
        open={formOpen}
        branch={editingBranch}
        restaurantId={restaurantId}
        loading={actionLoading}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
      />

      {/* Delete */}
      <DeleteBranchDialog
        open={Boolean(deleteBranch)}
        branch={deleteBranch}
        loading={actionLoading}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteBranch(null);
          }
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
}