import {
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import type {
  Employee,
} from "@/types/employee.types";

import EmployeeStatusBadge from "./EmployeeStatusBadge";

interface EmployeeTableProps {
  employees: Employee[];
  onView: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onStatusChange: (
    employee: Employee,
  ) => void;
  onDelete: (employee: Employee) => void;
}

function getUserName(employee: Employee) {
  if (typeof employee.userId === "string") {
    return employee.userId;
  }

  return (
    employee.userId.name ||
    [
      employee.userId.firstName,
      employee.userId.lastName,
    ]
      .filter(Boolean)
      .join(" ") ||
    employee.userId.email ||
    employee.userId._id
  );
}

function getBranchName(employee: Employee) {
  if (!employee.branchId) {
    return "All branches";
  }

  if (typeof employee.branchId === "string") {
    return employee.branchId;
  }

  return (
    employee.branchId.name ||
    employee.branchId._id
  );
}

function EmployeeTable({
  employees,
  onView,
  onEdit,
  onStatusChange,
  onDelete,
}: EmployeeTableProps) {
  if (employees.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
        <UsersEmptyIcon />

        <h3 className="mt-4 font-semibold text-gray-900">
          No employees found
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Try changing your search or status filter.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] text-left">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Employee
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Code
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Designation
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Department
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Branch
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
            {employees.map((employee) => (
              <tr
                key={employee._id}
                className="transition hover:bg-orange-50/30"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-sm font-bold text-[#FF6B35]">
                      {getUserName(employee)
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <p className="font-semibold text-gray-900">
                        {getUserName(employee)}
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
                </td>

                <td className="px-5 py-4 text-sm font-medium text-gray-700">
                  {employee.employeeCode}
                </td>

                <td className="px-5 py-4 text-sm text-gray-600">
                  {employee.designation}
                </td>

                <td className="px-5 py-4 text-sm text-gray-600">
                  {employee.department || "—"}
                </td>

                <td className="px-5 py-4 text-sm text-gray-600">
                  {getBranchName(employee)}
                </td>

                <td className="px-5 py-4">
                  <EmployeeStatusBadge
                    status={employee.status}
                  />
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      title="View"
                      onClick={() =>
                        onView(employee)
                      }
                      className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      title="Edit"
                      onClick={() =>
                        onEdit(employee)
                      }
                      className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      title="Change status"
                      onClick={() =>
                        onStatusChange(employee)
                      }
                      className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      title="Delete"
                      onClick={() =>
                        onDelete(employee)
                      }
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

function UsersEmptyIcon() {
  return (
    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50">
      <Eye className="h-6 w-6 text-[#FF6B35]" />
    </div>
  );
}

export default EmployeeTable;