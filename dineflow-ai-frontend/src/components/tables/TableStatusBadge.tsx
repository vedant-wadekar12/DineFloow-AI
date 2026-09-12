import { Badge } from "@/components/ui/badge";

import type { TableStatus } from "@/types/table.types";

interface TableStatusBadgeProps {
  status: TableStatus;
}

export default function TableStatusBadge({
  status,
}: TableStatusBadgeProps) {
  const labels: Record<
    TableStatus,
    string
  > = {
    AVAILABLE: "Available",
    OCCUPIED: "Occupied",
    RESERVED: "Reserved",
    INACTIVE: "Inactive",
  };

  return (
    <Badge variant="outline">
      <span
        className={`mr-1.5 h-2 w-2 rounded-full ${
          status === "AVAILABLE"
            ? "bg-green-500"
            : status === "OCCUPIED"
              ? "bg-red-500"
              : status === "RESERVED"
                ? "bg-yellow-500"
                : "bg-gray-400"
        }`}
      />

      {labels[status]}
    </Badge>
  );
}