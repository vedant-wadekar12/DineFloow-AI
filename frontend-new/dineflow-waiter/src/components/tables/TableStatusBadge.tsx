import type { TableStatus } from "@/types/table.types";

interface TableStatusBadgeProps {
  status: TableStatus;
}

const labels: Record<TableStatus, string> = {
  AVAILABLE: "Available",
  OCCUPIED: "Occupied",
  RESERVED: "Reserved",
  INACTIVE: "Inactive",
  CLEANING: "Cleaning",
  OUT_OF_SERVICE: "Out of Service",
};

const styles: Record<TableStatus, string> = {
  AVAILABLE:
    "bg-green-100 text-green-700 border-green-200",

  OCCUPIED:
    "bg-red-100 text-red-700 border-red-200",

  RESERVED:
    "bg-yellow-100 text-yellow-700 border-yellow-200",

  INACTIVE:
    "bg-gray-100 text-gray-700 border-gray-200",

  CLEANING:
    "bg-blue-100 text-blue-700 border-blue-200",

  OUT_OF_SERVICE:
    "bg-orange-100 text-orange-700 border-orange-200",
};

export default function TableStatusBadge({
  status,
}: TableStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}