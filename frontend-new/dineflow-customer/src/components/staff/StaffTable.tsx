import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import type { StaffMember } from "@/types/staff.types";

import StaffRoleBadge from "./StaffRoleBadge";
import StaffStatusBadge from "./StaffStatusBadge";

interface StaffTableProps {
  staff: StaffMember[];

  onView: (staff: StaffMember) => void;
  onEdit: (staff: StaffMember) => void;
  onDelete: (staff: StaffMember) => void;
}

export default function StaffTable({
  staff,
  onView,
  onEdit,
  onDelete,
}: StaffTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/40 text-left">
            <th className="p-4">Staff</th>
            <th className="p-4">Email</th>
            <th className="p-4">Role</th>
            <th className="p-4">Status</th>
            <th className="p-4">Last Login</th>
            <th className="p-4 text-right">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {staff.map((member) => (
            <tr
              key={member.id}
              className="border-b"
            >
              <td className="p-4">
                <div className="font-medium">
                  {member.firstName}{" "}
                  {member.lastName}
                </div>
              </td>

              <td className="p-4">
                {member.email}
              </td>

              <td className="p-4">
                <StaffRoleBadge
                  role={member.role}
                />
              </td>

              <td className="p-4">
                <StaffStatusBadge
                  isActive={
                    member.isActive
                  }
                />
              </td>

              <td className="p-4 text-muted-foreground">
                {member.lastLogin
                  ? new Date(
                      member.lastLogin,
                    ).toLocaleString()
                  : "Never"}
              </td>

              <td className="p-4">
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() =>
                      onView(member)
                    }
                  >
                    <Eye className="h-4 w-4" />
                  </Button>

                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() =>
                      onEdit(member)
                    }
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    onClick={() =>
                      onDelete(member)
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}

          {staff.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="p-10 text-center text-muted-foreground"
              >
                No staff members found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}