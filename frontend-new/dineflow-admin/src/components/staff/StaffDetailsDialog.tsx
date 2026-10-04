import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type {
  StaffMember,
} from "@/types/staff.types";

import StaffRoleBadge from "./StaffRoleBadge";
import StaffStatusBadge from "./StaffStatusBadge";

interface StaffDetailsDialogProps {
  open: boolean;

  staff: StaffMember | null;

  onOpenChange: (
    open: boolean,
  ) => void;
}

export default function StaffDetailsDialog({
  open,
  staff,
  onOpenChange,
}: StaffDetailsDialogProps) {
  if (!staff) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Staff Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">
              Name
            </p>

            <p className="font-medium">
              {staff.firstName}{" "}
              {staff.lastName}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Email
            </p>

            <p>{staff.email}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Phone
            </p>

            <p>
              {staff.phone ??
                "Not provided"}
            </p>
          </div>

          <div>
            <p className="mb-1 text-sm text-muted-foreground">
              Role
            </p>

            <StaffRoleBadge
              role={staff.role}
            />
          </div>

          <div>
            <p className="mb-1 text-sm text-muted-foreground">
              Status
            </p>

            <StaffStatusBadge
              isActive={
                staff.isActive
              }
            />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Last Login
            </p>

            <p>
              {staff.lastLogin
                ? new Date(
                    staff.lastLogin,
                  ).toLocaleString()
                : "Never"}
            </p>
          </div>

          {staff.permissions &&
            staff.permissions
              .length > 0 && (
              <div>
                <p className="mb-2 text-sm text-muted-foreground">
                  Permissions
                </p>

                <div className="flex flex-wrap gap-2">
                  {staff.permissions.map(
                    (permission) => (
                      <span
                        key={permission}
                        className="rounded-md bg-muted px-2 py-1 text-xs"
                      >
                        {permission}
                      </span>
                    ),
                  )}
                </div>
              </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}