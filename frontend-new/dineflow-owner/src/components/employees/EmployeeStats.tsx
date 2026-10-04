import {
  BriefcaseBusiness,
  CheckCircle2,
  Users,
  UserX,
} from "lucide-react";

import type {
  Employee,
} from "@/types/employee.types";

interface EmployeeStatsProps {
  employees: Employee[];
}

function EmployeeStats({
  employees,
}: EmployeeStatsProps) {
  const active = employees.filter(
    (employee) =>
      employee.status === "ACTIVE",
  ).length;

  const inactive = employees.filter(
    (employee) =>
      employee.status === "INACTIVE",
  ).length;

  const departments = new Set(
    employees
      .map((employee) => employee.department)
      .filter(Boolean),
  ).size;

  const stats = [
    {
      label: "Total Employees",
      value: employees.length,
      icon: Users,
    },
    {
      label: "Active",
      value: active,
      icon: CheckCircle2,
    },
    {
      label: "Inactive",
      value: inactive,
      icon: UserX,
    },
    {
      label: "Departments",
      value: departments,
      icon: BriefcaseBusiness,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {stat.label}
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </div>

              <div className="rounded-xl bg-orange-50 p-3">
                <Icon className="h-5 w-5 text-[#FF6B35]" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default EmployeeStats;