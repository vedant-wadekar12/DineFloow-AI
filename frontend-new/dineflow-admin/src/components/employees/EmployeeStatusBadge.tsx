import type { EmployeeStatus } from "@/types/employee.types";

interface EmployeeStatusBadgeProps {
  status: EmployeeStatus;
}

function EmployeeStatusBadge({
  status,
}: EmployeeStatusBadgeProps) {
  const styles: Record<
    EmployeeStatus,
    string
  > = {
    ACTIVE:
      "bg-emerald-50 text-emerald-700",
    INACTIVE:
      "bg-gray-100 text-gray-600",
    SUSPENDED:
      "bg-yellow-50 text-yellow-700",
    TERMINATED:
      "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export default EmployeeStatusBadge;