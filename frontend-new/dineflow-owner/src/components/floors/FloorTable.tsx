import {
  Eye,
  MoreHorizontal,
  Pencil,
  Power,
  Trash2,
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

import FloorStatusBadge from "./FloorStatusBadge";

import type { Floor } from "@/types/floor.types";

interface FloorTableProps {
  floors: Floor[];

  onView: (floor: Floor) => void;
  onEdit: (floor: Floor) => void;
  onDelete: (floor: Floor) => void;
  onToggleStatus: (floor: Floor) => void;
}

export default function FloorTable({
  floors,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}: FloorTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Floor</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Floor Number</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {floors.map((floor) => (
            <TableRow key={floor.id}>
              <TableCell>
                <p className="font-medium">
                  {floor.name}
                </p>
              </TableCell>

              <TableCell>
                {floor.code || "—"}
              </TableCell>

              <TableCell>
                {floor.floorNumber ?? "—"}
              </TableCell>

              <TableCell>
                <p className="max-w-[250px] truncate text-sm text-muted-foreground">
                  {floor.description || "—"}
                </p>
              </TableCell>

              <TableCell>
                <FloorStatusBadge
                  status={floor.status}
                />
              </TableCell>

              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger>
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
                      onClick={() => onView(floor)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => onEdit(floor)}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() =>
                        onToggleStatus(floor)
                      }
                    >
                      <Power className="mr-2 h-4 w-4" />
                      {floor.status === "ACTIVE"
                        ? "Deactivate"
                        : "Activate"}
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => onDelete(floor)}
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