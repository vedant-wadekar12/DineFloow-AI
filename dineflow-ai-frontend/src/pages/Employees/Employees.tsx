import {
  AlertCircle,
  Loader2,
  Plus,
  RefreshCw,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import * as employeeService from "@/services/employees/employee.service";

import type {
  CreateEmployeeData,
  Employee,
  EmployeeStatus,
  UpdateEmployeeData,
} from "@/types/employee.types";

import EmployeeStats from "@/components/employees/EmployeeStats";
import EmployeeFilters from "@/components/employees/EmployeeFilters";
import EmployeeTable from "@/components/employees/EmployeeTable";
import EmployeeFormDialog from "@/components/employees/EmployeeFormDialog";
import EmployeeDetailsDialog from "@/components/employees/EmployeeDetailsDialog";
import DeleteEmployeeDialog from "@/components/employees/DeleteEmployeeDialog";

import { useRestaurant } from "@/context/RestaurantContext";

function Employees() {
  const {
    selectedRestaurantId,
    selectedRestaurant,
  } = useRestaurant();

  const [employees, setEmployees] =
    useState<Employee[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState<"ALL" | EmployeeStatus>("ALL");

  const [formOpen, setFormOpen] =
    useState(false);

  const [editingEmployee, setEditingEmployee] =
    useState<Employee | null>(null);

  const [viewingEmployee, setViewingEmployee] =
    useState<Employee | null>(null);

  const [deletingEmployee, setDeletingEmployee] =
    useState<Employee | null>(null);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError(null);

      const data =
        await employeeService.getAllEmployees();

      setEmployees(data);
    } catch (error) {
      console.error(
        "Employee loading error:",
        error,
      );

      setError(
        "Unable to load employees. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadEmployees();
  }, []);

  const restaurantEmployees = useMemo(() => {
    if (!selectedRestaurantId) {
      return employees;
    }

    return employees.filter(
      (employee) =>
        employee.restaurantId ===
        selectedRestaurantId,
    );
  }, [
    employees,
    selectedRestaurantId,
  ]);

  const filteredEmployees = useMemo(() => {
    const query =
      search.toLowerCase().trim();

    return restaurantEmployees.filter(
      (employee) => {
        const userName =
          typeof employee.userId ===
          "string"
            ? employee.userId
            : [
                employee.userId.firstName,
                employee.userId.lastName,
                employee.userId.name,
                employee.userId.email,
              ]
                .filter(Boolean)
                .join(" ");

        const matchesSearch =
          query.length === 0 ||
          userName
            .toLowerCase()
            .includes(query) ||
          employee.employeeCode
            .toLowerCase()
            .includes(query) ||
          employee.designation
            .toLowerCase()
            .includes(query) ||
          employee.department
            ?.toLowerCase()
            .includes(query);

        const matchesStatus =
          status === "ALL" ||
          employee.status === status;

        return (
          matchesSearch &&
          matchesStatus
        );
      },
    );
  }, [
    restaurantEmployees,
    search,
    status,
  ]);

  const handleCreate = async (
    data: CreateEmployeeData,
  ) => {
    try {
      setActionLoading(true);
      setError(null);

      const created =
        await employeeService.createEmployee(
          data,
        );

      setEmployees((current) => [
        created,
        ...current,
      ]);

      setFormOpen(false);
    } catch (error) {
      console.error(
        "Employee creation error:",
        error,
      );

      setError(
        "Unable to create employee. Please check the selected user and employee details.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (
    data: UpdateEmployeeData,
  ) => {
    if (!editingEmployee) {
      return;
    }

    try {
      setActionLoading(true);
      setError(null);

      const updated =
        await employeeService.updateEmployee(
          editingEmployee._id,
          data,
        );

      setEmployees((current) =>
        current.map((employee) =>
          employee._id === updated._id
            ? updated
            : employee,
        ),
      );

      setEditingEmployee(null);
      setFormOpen(false);
    } catch (error) {
      console.error(
        "Employee update error:",
        error,
      );

      setError(
        "Unable to update employee.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusChange = async (
    employee: Employee,
  ) => {
    const nextStatus: EmployeeStatus =
      employee.status === "ACTIVE"
        ? "INACTIVE"
        : "ACTIVE";

    try {
      setActionLoading(true);
      setError(null);

      const updated =
        await employeeService.updateEmployeeStatus(
          employee._id,
          {
            status: nextStatus,
          },
        );

      setEmployees((current) =>
        current.map((item) =>
          item._id === updated._id
            ? updated
            : item,
        ),
      );
    } catch (error) {
      console.error(
        "Employee status error:",
        error,
      );

      setError(
        "Unable to update employee status.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingEmployee) {
      return;
    }

    try {
      setActionLoading(true);
      setError(null);

      await employeeService.deleteEmployee(
        deletingEmployee._id,
      );

      setEmployees((current) =>
        current.filter(
          (employee) =>
            employee._id !==
            deletingEmployee._id,
        ),
      );

      setDeletingEmployee(null);
    } catch (error) {
      console.error(
        "Employee delete error:",
        error,
      );

      setError(
        "Unable to delete employee.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const openCreate = () => {
    if (!selectedRestaurantId) {
      setError(
        "Please select a restaurant before adding an employee.",
      );
      return;
    }

    setError(null);
    setEditingEmployee(null);
    setFormOpen(true);
  };

  const openEdit = (employee: Employee) => {
    setError(null);
    setEditingEmployee(employee);
    setFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-orange-50 p-3">
              <Users className="h-6 w-6 text-[#FF6B35]" />
            </div>

            <div>
              <p className="text-sm font-medium text-[#FF6B35]">
                Phase 14
              </p>

              <h1 className="text-2xl font-bold text-gray-900">
                Employees
              </h1>
            </div>
          </div>

          <p className="mt-2 text-sm text-gray-500">
            Manage restaurant employees,
            assignments, status and employee
            records.
          </p>

          {selectedRestaurant && (
            <p className="mt-2 text-sm font-medium text-gray-700">
              Restaurant:{" "}
              <span className="text-[#FF6B35]">
                {selectedRestaurant.name}
              </span>
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={() =>
              void loadEmployees()
            }
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
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6B35] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#e85d2c]"
          >
            <Plus className="h-4 w-4" />
            Add Employee
          </button>
        </div>
      </div>

      {!selectedRestaurantId && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

          <div>
            <p className="font-semibold text-amber-800">
              Select a restaurant
            </p>

            <p className="mt-1 text-sm text-amber-700">
              Please select a restaurant from
              the restaurant selector before
              adding employees.
            </p>
          </div>
        </div>
      )}

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

      <EmployeeStats
        employees={restaurantEmployees}
      />

      <EmployeeFilters
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
            Loading employees...
          </div>
        </div>
      ) : (
        <EmployeeTable
          employees={filteredEmployees}
          onView={setViewingEmployee}
          onEdit={openEdit}
          onStatusChange={
            handleStatusChange
          }
          onDelete={setDeletingEmployee}
        />
      )}

      {actionLoading && (
        <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white shadow-xl">
          <Loader2 className="h-4 w-4 animate-spin" />
          Updating...
        </div>
      )}

      <EmployeeFormDialog
        open={formOpen}
        loading={actionLoading}
        employee={editingEmployee}
        restaurantId={
          selectedRestaurantId || ""
        }
        restaurantName={
          selectedRestaurant?.name
        }
        existingEmployees={
          restaurantEmployees
        }
        onClose={() => {
          setFormOpen(false);
          setEditingEmployee(null);
        }}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />

      <EmployeeDetailsDialog
        employee={viewingEmployee}
        onClose={() =>
          setViewingEmployee(null)
        }
      />

      <DeleteEmployeeDialog
        employee={deletingEmployee}
        loading={actionLoading}
        onClose={() =>
          setDeletingEmployee(null)
        }
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default Employees;