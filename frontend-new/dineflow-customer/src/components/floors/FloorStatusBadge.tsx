import { Badge } from "@/components/ui/badge";

import type { FloorStatus } from "@/types/floor.types";

interface FloorStatusBadgeProps {
  status: FloorStatus;
}

export default function FloorStatusBadge({
  status,
}: FloorStatusBadgeProps) {
  return (
    <Badge
      variant={
        status === "ACTIVE"
          ? "default"
          : "secondary"
      }
    >
      <span
        className={`mr-1.5 h-2 w-2 rounded-full ${
          status === "ACTIVE"
            ? "bg-green-500"
            : "bg-gray-400"
        }`}
      />

      {status === "ACTIVE"
        ? "Active"
        : "Inactive"}
    </Badge>
  );
}