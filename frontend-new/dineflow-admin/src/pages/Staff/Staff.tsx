import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Plus,
} from "lucide-react";

import {
  Button,
} from "@/components/ui/button";

import StaffStats from "@/components/staff/StaffStats";
import StaffFilters from "@/components/staff/StaffFilters";
import StaffTable from "@/components/staff/StaffTable";
import StaffFormDialog from "@/components/staff/StaffFormDialog";
import StaffDetailsDialog from "@/components/staff/StaffDetailsDialog";
import DeleteStaffDialog from "@/components/staff/DeleteStaffDialog";

import { useRestaurant } from "@/context/RestaurantContext";

import * as staffService from "@/services/staff/staff.service";

import type {
  StaffMember,
  StaffStats as StaffStatsType,
  CreateStaffData,
  UpdateStaffData,
} from "@/types/staff.types";

const SELECTED_BRANCH_KEY =
  "dineflow_selected_branch";

export default function Staff() {
  const {
    selectedRestaurantId,
  } = useRestaurant();

  const restaurantId =
    selectedRestaurantId ?? "";

  const [
    staff,
    setStaff,
  ] = useState<StaffMember[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    role,
    setRole,
  ] = useState("");

  const [
    status,
    setStatus,
  ] = useState("");

  const [
    formOpen,
    setFormOpen,
  ] = useState(false);

  const [
    detailsOpen,
    setDetailsOpen,
  ] = useState(false);

  const [
    deleteOpen,
    setDeleteOpen,
  ] = useState(false);

  const [
    editingStaff,
    setEditingStaff,
  ] = useState<StaffMember | null>(
    null,
  );

  const [
    selectedStaff,
    setSelectedStaff,
  ] = useState<StaffMember | null>(
    null,
  );

  const loadStaff = async () => {
    if (!restaurantId) {
      setStaff([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const data =
        await staffService.getStaff(
          restaurantId,
        );

      setStaff(
        Array.isArray(data)
          ? data
          : [],
      );
    } catch (error) {
      console.error(
        "Failed to load staff:",
        error,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadStaff();
  }, [restaurantId]);

  const stats: StaffStatsType =
    useMemo(() => {
      return {
        totalStaff: staff.length,

        activeStaff:
          staff.filter(
            (member) =>
              member.isActive,
          ).length,

        inactiveStaff:
          staff.filter(
            (member) =>
              !member.isActive,
          ).length,

        owners:
          staff.filter(
            (member) =>
              member.role ===
              "RESTAURANT_OWNER",
          ).length,

        managers:
          staff.filter(
            (member) =>
              member.role ===
              "BRANCH_MANAGER",
          ).length,

        cashiers:
          staff.filter(
            (member) =>
              member.role ===
              "CASHIER",
          ).length,

        waiters:
          staff.filter(
            (member) =>
              member.role ===
              "WAITER",
          ).length,

        chefs:
          staff.filter(
            (member) =>
              member.role ===
              "CHEF",
          ).length,

        kitchenStaff:
          staff.filter(
            (member) =>
              member.role ===
              "KITCHEN_STAFF",
          ).length,
      };
    }, [staff]);

  const filteredStaff =
    useMemo(() => {
      return staff.filter(
        (member) => {
          const fullName =
            `${member.firstName} ${member.lastName}`
              .toLowerCase();

          const searchValue =
            search
              .trim()
              .toLowerCase();

          const matchesSearch =
            !searchValue ||
            fullName.includes(
              searchValue,
            ) ||
            member.email
              .toLowerCase()
              .includes(
                searchValue,
              );

          const matchesRole =
            !role ||
            member.role === role;

          const matchesStatus =
            !status ||
            (status === "active"
              ? member.isActive
              : !member.isActive);

          return (
            matchesSearch &&
            matchesRole &&
            matchesStatus
          );
        },
      );
    }, [
      staff,
      search,
      role,
      status,
    ]);

  const handleSubmit =
    async (
      data:
        | CreateStaffData
        | UpdateStaffData,
    ) => {
      try {
        setSaving(true);

        const branchId =
          data.branchId?.trim() ||
          localStorage.getItem(
            SELECTED_BRANCH_KEY,
          ) ||
          undefined;

        if (editingStaff) {
          await staffService.updateStaff(
            editingStaff.id,
            {
              ...data,
              branchId,
            },
          );
        } else {
          if (!restaurantId) {
            throw new Error(
              "No restaurant selected.",
            );
          }

          await staffService.createStaff(
            {
              ...data,
              branchId,
              restaurantId,
            } as CreateStaffData & {
              restaurantId: string;
            },
          );
        }

        setFormOpen(false);
        setEditingStaff(null);

        await loadStaff();
      } catch (error) {
        console.error(
          "Failed to save staff:",
          error,
        );
      } finally {
        setSaving(false);
      }
    };

  const handleDelete =
    async () => {
      if (!selectedStaff) {
        return;
      }

      try {
        setSaving(true);

        await staffService.deleteStaff(
          selectedStaff.id,
        );

        setDeleteOpen(false);
        setSelectedStaff(null);

        await loadStaff();
      } catch (error) {
        console.error(
          "Failed to delete staff:",
          error,
        );
      } finally {
        setSaving(false);
      }
    };

  if (loading) {
    return (
      <div className="p-6">
        Loading staff...
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-semibold">
            Staff Management
          </h1>

          <p className="mt-1 text-muted-foreground">
            Manage restaurant employees,
            roles and access.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => {
            setEditingStaff(null);
            setFormOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Staff
        </Button>
      </div>

      <StaffStats stats={stats} />

      <StaffFilters
        search={search}
        role={role}
        status={status}
        onSearchChange={setSearch}
        onRoleChange={setRole}
        onStatusChange={setStatus}
      />

      <StaffTable
        staff={filteredStaff}
        onView={(member) => {
          setSelectedStaff(member);
          setDetailsOpen(true);
        }}
        onEdit={(member) => {
          setEditingStaff(member);
          setFormOpen(true);
        }}
        onDelete={(member) => {
          setSelectedStaff(member);
          setDeleteOpen(true);
        }}
      />

      <StaffFormDialog
        open={formOpen}
        staff={editingStaff}
        loading={saving}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
      />

      <StaffDetailsDialog
        open={detailsOpen}
        staff={selectedStaff}
        onOpenChange={setDetailsOpen}
      />

      <DeleteStaffDialog
        open={deleteOpen}
        staff={selectedStaff}
        loading={saving}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
      />
    </div>
  );
}