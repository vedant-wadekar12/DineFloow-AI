import {
  AlertCircle,
  ChevronDown,
  Loader2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import type {
  CreateEmployeeData,
  Employee,
  UpdateEmployeeData,
} from "@/types/employee.types";

import type { Branch } from "@/types/branch.types";

import { getBranches } from "@/services/branches/branch.service";
import { getUsers, type User } from "@/services/users/user.service";

interface EmployeeFormDialogProps {
  open: boolean;
  loading: boolean;
  employee: Employee | null;
  restaurantId: string;
  restaurantName?: string;
  existingEmployees: Employee[];
  onClose: () => void;
  onCreate: (
    data: CreateEmployeeData,
  ) => Promise<void>;
  onUpdate: (
    data: UpdateEmployeeData,
  ) => Promise<void>;
}

interface FormState {
  userId: string;
  restaurantId: string;
  branchId: string;
  employeeCode: string;
  designation: string;
  department: string;
  joiningDate: string;
  dateOfBirth: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  salary: string;
  notes: string;
}

const initialState: FormState = {
  userId: "",
  restaurantId: "",
  branchId: "",
  employeeCode: "",
  designation: "",
  department: "",
  joiningDate: "",
  dateOfBirth: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  salary: "",
  notes: "",
};

function getUserId(employee: Employee): string {
  return typeof employee.userId === "string"
    ? employee.userId
    : employee.userId._id;
}

function getBranchId(employee: Employee): string {
  if (!employee.branchId) {
    return "";
  }

  return typeof employee.branchId === "string"
    ? employee.branchId
    : employee.branchId._id;
}

function getUserName(user: User): string {
  const fullName = [
    user.firstName,
    user.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || user.email || "Unnamed User";
}

function EmployeeFormDialog({
  open,
  loading,
  employee,
  restaurantId,
  restaurantName,
  existingEmployees,
  onClose,
  onCreate,
  onUpdate,
}: EmployeeFormDialogProps) {
  const [form, setForm] =
    useState<FormState>(initialState);

  const [users, setUsers] =
    useState<User[]>([]);

  const [branches, setBranches] =
    useState<Branch[]>([]);

  const [dataLoading, setDataLoading] =
    useState(false);

  const [dataError, setDataError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (employee) {
      setForm({
        userId: getUserId(employee),
        restaurantId: employee.restaurantId,
        branchId: getBranchId(employee),
        employeeCode:
          employee.employeeCode,
        designation:
          employee.designation,
        department:
          employee.department || "",
        joiningDate:
          employee.joiningDate?.slice(0, 10) || "",
        dateOfBirth:
          employee.dateOfBirth?.slice(0, 10) || "",
        emergencyContactName:
          employee.emergencyContactName || "",
        emergencyContactPhone:
          employee.emergencyContactPhone || "",
        salary:
          employee.salary !== undefined
            ? String(employee.salary)
            : "",
        notes:
          employee.notes || "",
      });
    } else {
      setForm({
        ...initialState,
        restaurantId,
      });
    }
  }, [open, employee, restaurantId]);

  useEffect(() => {
    if (!open || !restaurantId) {
      return;
    }

    let cancelled = false;

    const loadFormData = async () => {
      try {
        setDataLoading(true);
        setDataError(null);

        const [usersData, branchesData] =
          await Promise.all([
            getUsers(),
            getBranches(restaurantId),
          ]);

        if (cancelled) {
          return;
        }

        setUsers(usersData);
        setBranches(
          branchesData.filter(
            (branch) =>
              branch.status === "ACTIVE",
          ),
        );
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Employee form data error:",
          error,
        );

        setDataError(
          "Unable to load users or branches.",
        );
      } finally {
        if (!cancelled) {
          setDataLoading(false);
        }
      }
    };

    void loadFormData();

    return () => {
      cancelled = true;
    };
  }, [open, restaurantId]);

  const assignedUserIds = useMemo(() => {
    return new Set(
      existingEmployees
        .filter(
          (item) =>
            item._id !== employee?._id,
        )
        .map((item) =>
          getUserId(item),
        ),
    );
  }, [existingEmployees, employee]);

  const availableUsers = useMemo(() => {
    return users.filter((user) => {
      if (user.isDeleted) {
        return false;
      }

      if (employee && user._id === form.userId) {
        return true;
      }

      return !assignedUserIds.has(user._id);
    });
  }, [
    users,
    employee,
    form.userId,
    assignedUserIds,
  ]);

  if (!open) {
    return null;
  }

  const setField = (
    field: keyof FormState,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!restaurantId) {
      setDataError(
        "No restaurant is selected. Please select a restaurant first.",
      );
      return;
    }

    if (!employee && !form.userId) {
      setDataError(
        "Please select a user.",
      );
      return;
    }

    if (employee) {
      await onUpdate({
        branchId:
          form.branchId || undefined,
        employeeCode:
          form.employeeCode || undefined,
        designation:
          form.designation || undefined,
        department:
          form.department || undefined,
        joiningDate:
          form.joiningDate || undefined,
        dateOfBirth:
          form.dateOfBirth || undefined,
        emergencyContactName:
          form.emergencyContactName ||
          undefined,
        emergencyContactPhone:
          form.emergencyContactPhone ||
          undefined,
        salary:
          form.salary === ""
            ? undefined
            : Number(form.salary),
        notes:
          form.notes || undefined,
      });

      return;
    }

    await onCreate({
      userId: form.userId,
      restaurantId,
      branchId:
        form.branchId || undefined,
      employeeCode:
        form.employeeCode,
      designation:
        form.designation,
      department:
        form.department || undefined,
      joiningDate:
        form.joiningDate || undefined,
      dateOfBirth:
        form.dateOfBirth || undefined,
      emergencyContactName:
        form.emergencyContactName ||
        undefined,
      emergencyContactPhone:
        form.emergencyContactPhone ||
        undefined,
      salary:
        form.salary === ""
          ? undefined
          : Number(form.salary),
      notes:
        form.notes || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-4 backdrop-blur-sm">
      <div className="mx-auto my-8 w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[#FF6B35]">
              Phase 14
            </p>

            <h2 className="mt-1 text-xl font-bold text-gray-900">
              {employee
                ? "Edit Employee"
                : "Add Employee"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {employee
                ? "Update employee information and assignment."
                : "Assign an existing user to your restaurant."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {dataError && (
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

            <p className="text-sm text-red-700">
              {dataError}
            </p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-6 grid gap-4 sm:grid-cols-2"
        >
          {/* Restaurant */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Restaurant
            </label>

            <div className="flex h-11 items-center rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700">
              <div>
                <p className="font-medium">
                  {restaurantName ||
                    "Selected Restaurant"}
                </p>

                <p className="text-xs text-gray-400">
                  Automatically selected
                </p>
              </div>
            </div>
          </div>

          {/* User */}
          {!employee ? (
            <SelectField
              label="User"
              value={form.userId}
              onChange={(value) =>
                setField("userId", value)
              }
              required
              disabled={
                dataLoading ||
                loading ||
                !restaurantId
              }
              placeholder={
                dataLoading
                  ? "Loading users..."
                  : availableUsers.length === 0
                    ? "No available users"
                    : "Select user"
              }
            >
              {availableUsers.map((user) => (
                <option
                  key={user._id}
                  value={user._id}
                >
                  {getUserName(user)}
                  {user.email
                    ? ` — ${user.email}`
                    : ""}
                </option>
              ))}
            </SelectField>
          ) : (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                User
              </label>

              <div className="flex min-h-11 items-center rounded-xl border border-gray-200 bg-gray-50 px-3">
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {typeof employee.userId ===
                    "string"
                      ? "Assigned User"
                      : getUserName({
                          _id: employee.userId._id,
                          firstName:
                            employee.userId
                              .firstName,
                          lastName:
                            employee.userId
                              .lastName,
                          email:
                            employee.userId.email,
                        })}
                  </p>

                  {typeof employee.userId !==
                    "string" &&
                    employee.userId.email && (
                      <p className="text-xs text-gray-500">
                        {employee.userId.email}
                      </p>
                    )}
                </div>
              </div>
            </div>
          )}

          {/* Branch */}
          <SelectField
            label="Branch"
            value={form.branchId}
            onChange={(value) =>
              setField("branchId", value)
            }
            disabled={
              dataLoading ||
              loading ||
              branches.length === 0
            }
            placeholder={
              dataLoading
                ? "Loading branches..."
                : branches.length === 0
                  ? "No active branches"
                  : "Select branch"
            }
          >
            {branches.map((branch) => (
              <option
                key={branch.id}
                value={branch.id}
              >
                {branch.name}
              </option>
            ))}
          </SelectField>

          <Field
            label="Employee Code"
            value={form.employeeCode}
            onChange={(value) =>
              setField(
                "employeeCode",
                value,
              )
            }
            required
          />

          <Field
            label="Designation"
            value={form.designation}
            onChange={(value) =>
              setField(
                "designation",
                value,
              )
            }
            required
            placeholder="e.g. Waiter"
          />

          <Field
            label="Department"
            value={form.department}
            onChange={(value) =>
              setField(
                "department",
                value,
              )
            }
            placeholder="e.g. Service"
          />

          <Field
            label="Joining Date"
            type="date"
            value={form.joiningDate}
            onChange={(value) =>
              setField(
                "joiningDate",
                value,
              )
            }
          />

          <Field
            label="Date of Birth"
            type="date"
            value={form.dateOfBirth}
            onChange={(value) =>
              setField(
                "dateOfBirth",
                value,
              )
            }
          />

          <Field
            label="Emergency Contact Name"
            value={
              form.emergencyContactName
            }
            onChange={(value) =>
              setField(
                "emergencyContactName",
                value,
              )
            }
          />

          <Field
            label="Emergency Contact Phone"
            value={
              form.emergencyContactPhone
            }
            onChange={(value) =>
              setField(
                "emergencyContactPhone",
                value,
              )
            }
          />

          <Field
            label="Salary"
            type="number"
            min="0"
            value={form.salary}
            onChange={(value) =>
              setField("salary", value)
            }
          />

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Notes
            </label>

            <textarea
              value={form.notes}
              onChange={(event) =>
                setField(
                  "notes",
                  event.target.value,
                )
              }
              rows={4}
              maxLength={1000}
              placeholder="Optional notes about this employee..."
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <div className="flex gap-3 pt-2 sm:col-span-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                loading ||
                dataLoading ||
                (!employee &&
                  !form.userId)
              }
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#FF6B35] px-4 py-3 text-sm font-semibold text-white hover:bg-[#e85d2c] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {(loading || dataLoading) && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              {employee
                ? "Save Changes"
                : "Create Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  min?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  min,
  required = false,
  disabled = false,
  placeholder,
}: FieldProps) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        type={type}
        min={min}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-orange-100 disabled:bg-gray-100"
      />
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  placeholder: string;
}

function SelectField({
  label,
  value,
  onChange,
  children,
  required = false,
  disabled = false,
  placeholder,
}: SelectFieldProps) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          required={required}
          disabled={disabled}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white px-3 pr-10 text-sm outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-orange-100 disabled:bg-gray-100"
        >
          <option value="">
            {placeholder}
          </option>

          {children}
        </select>

        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  );
}

export default EmployeeFormDialog;