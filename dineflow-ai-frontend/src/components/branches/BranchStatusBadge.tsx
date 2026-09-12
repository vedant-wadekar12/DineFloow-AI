import { Badge } from "@/components/ui/badge";

import type { BranchStatus } from "@/types/branch.types";

interface BranchStatusBadgeProps {
  status: BranchStatus;
}

export default function BranchStatusBadge({
  status,
}: BranchStatusBadgeProps) {
  const isActive = status === "ACTIVE";

  return (
    <Badge variant={isActive ? "default" : "secondary"}>
      <span
        className={`mr-1.5 h-2 w-2 rounded-full ${
          isActive ? "bg-green-500" : "bg-gray-400"
        }`}
      />

      {isActive ? "Active" : "Inactive"}
    </Badge>
  );
}