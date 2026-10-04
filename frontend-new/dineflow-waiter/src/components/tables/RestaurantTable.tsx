import {
  Eye,
  MoreHorizontal,
  Pencil,
  QrCode,
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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import TableStatusBadge from "./TableStatusBadge";

import type {
  RestaurantTable as RestaurantTableType,
} from "@/types/table.types";

interface RestaurantTableProps {
  tables: RestaurantTableType[];

  onView: (
    table: RestaurantTableType,
  ) => void;

  onEdit: (
    table: RestaurantTableType,
  ) => void;

  onDelete: (
    table: RestaurantTableType,
  ) => void;

  onGenerateQR: (
    table: RestaurantTableType,
  ) => void;

  actionLoading?: boolean;
}

export default function RestaurantTable({
  tables,
  onView,
  onEdit,
  onDelete,
  onGenerateQR,
  actionLoading = false,
}: RestaurantTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              Table
            </TableHead>

            <TableHead>
              Number
            </TableHead>

            <TableHead>
              Type
            </TableHead>

            <TableHead>
              Capacity
            </TableHead>

            <TableHead>
              Status
            </TableHead>

            <TableHead>
              QR
            </TableHead>

            <TableHead className="text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {tables.map(
            (table) => (
              <TableRow
                key={table.id}
              >
                <TableCell>
                  <p className="font-medium">
                    {table.name}
                  </p>
                </TableCell>

                <TableCell>
                  {table.tableNumber ??
                    "—"}
                </TableCell>

                <TableCell>
                  {table.type ??
                    "Standard"}
                </TableCell>

                <TableCell>
                  {table.capacity}
                </TableCell>

                <TableCell>
                  <TableStatusBadge
                    status={
                      table.status
                    }
                  />
                </TableCell>

                <TableCell>
                  {table.qrCode ||
                  table.qrUrl ? (
                    <span className="text-sm font-medium text-green-600">
                      Generated
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Not generated
                    </span>
                  )}
                </TableCell>

                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      type="button"
                      aria-label={`Actions for ${table.name}`}
                      disabled={
                        actionLoading
                      }
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          onView(
                            table,
                          )
                        }
                      >
                        <Eye className="mr-2 h-4 w-4" />

                        View
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() =>
                          onEdit(
                            table,
                          )
                        }
                      >
                        <Pencil className="mr-2 h-4 w-4" />

                        Edit
                      </DropdownMenuItem>

                      {!(
                        table.qrCode ||
                        table.qrUrl
                      ) && (
                        <DropdownMenuItem
                          onClick={() =>
                            onGenerateQR(
                              table,
                            )
                          }
                        >
                          <QrCode className="mr-2 h-4 w-4" />

                          Generate QR
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() =>
                          onDelete(
                            table,
                          )
                        }
                      >
                        <Trash2 className="mr-2 h-4 w-4" />

                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ),
          )}
        </TableBody>
      </Table>
    </div>
  );
}