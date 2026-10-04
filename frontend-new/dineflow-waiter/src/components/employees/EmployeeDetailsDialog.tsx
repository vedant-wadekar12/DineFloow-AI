import { X } from "lucide-react";

import type {
  Employee,
} from "@/types/employee.types";

interface EmployeeDetailsDialogProps {
  employee: Employee | null;
  onClose: () => void;
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

function EmployeeDetailsDialog({
  employee,
  onClose,
}: EmployeeDetailsDialogProps) {
  if (!employee) {
    return null;
  }

  const details = [
    ["Employee Code", employee.employeeCode],
    ["User", getUserName(employee)],
    ["Designation", employee.designation],
    [
      "Department",
      employee.department || "—",
    ],
    [
      "Joining Date",
      employee.joiningDate
        ? new Date(
            employee.joiningDate,
          ).toLocaleDateString()
        : "—",
    ],
    [
      "Date of Birth",
      employee.dateOfBirth
        ? new Date(
            employee.dateOfBirth,
          ).toLocaleDateString()
        : "—",
    ],
    [
      "Emergency Contact",
      employee.emergencyContactName ||
        "—",
    ],
    [
      "Emergency Phone",
      employee.emergencyContactPhone ||
        "—",
    ],
    [
      "Salary",
      employee.salary !== undefined
        ? `₹${employee.salary.toLocaleString()}`
        : "—",
    ],
    [
      "Status",
      employee.status,
    ],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[#FF6B35]">
              Employee Details
            </p>

            <h2 className="mt-1 text-xl font-bold text-gray-900">
              {getUserName(employee)}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {details.map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl bg-gray-50 p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                {label}
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                {value}
              </p>
            </div>
          ))}
        </div>

        {employee.notes && (
          <div className="mt-3 rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Notes
            </p>

            <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">
              {employee.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployeeDetailsDialog;