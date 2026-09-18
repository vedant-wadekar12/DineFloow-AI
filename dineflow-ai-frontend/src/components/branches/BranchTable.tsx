import {
  MoreHorizontal,
  Pencil,
  Eye,
  Trash2,
  Power,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import BranchStatusBadge from "./BranchStatusBadge";

import type { Branch } from "@/types/branch.types";

interface BranchTableProps {
  branches: Branch[];
  onView: (branch: Branch) => void;
  onEdit: (branch: Branch) => void;
  onDelete: (branch: Branch) => void;
  onToggleStatus: (branch: Branch) => void;
}

export default function BranchTable({
  branches,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}: BranchTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Branch</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {branches.map((branch) => (
            <TableRow key={branch.id}>
              <TableCell>
                <div>
                  <p className="font-medium">
                    {branch.name}
                  </p>

                  {branch.managerName && (
                    <p className="text-xs text-muted-foreground">
                      Manager: {branch.managerName}
                    </p>
                  )}
                </div>
              </TableCell>

              <TableCell>
                {branch.code || "—"}
              </TableCell>

              <TableCell>
  <div className="max-w-[220px]">
    <p>{branch.address}</p>

    <p className="text-xs text-muted-foreground">
      {[branch.city, branch.state, branch.country]
        .filter(Boolean)
        .join(", ")}
    </p>
  </div>
</TableCell>

              <TableCell>
                <div>
                  <p className="text-sm">
                    {branch.phone || "—"}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {branch.email || ""}
                  </p>
                </div>
              </TableCell>

              <TableCell>
                <BranchStatusBadge
                  status={branch.status}
                />
              </TableCell>

              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger >
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => onView(branch)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => onEdit(branch)}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() =>
                        onToggleStatus(branch)
                      }
                    >
                      <Power className="mr-2 h-4 w-4" />
                      {branch.status === "ACTIVE"
                        ? "Deactivate"
                        : "Activate"}
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => onDelete(branch)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}