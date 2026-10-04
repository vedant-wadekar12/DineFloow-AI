import {
  AlertTriangle,
} from "lucide-react";

import {
  Button,
} from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type {
  StaffMember,
} from "@/types/staff.types";

interface DeleteStaffDialogProps {
  open: boolean;

  staff: StaffMember | null;

  loading?: boolean;

  onOpenChange: (
    open: boolean,
  ) => void;

  onConfirm: () => Promise<void>;
}

export default function DeleteStaffDialog({
  open,
  staff,
  loading = false,
  onOpenChange,
  onConfirm,
}: DeleteStaffDialogProps) {
  if (!staff) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Delete Staff Member
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-3">
          <AlertTriangle className="mt-1 h-5 w-5 text-red-500" />

          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <strong>
              {staff.firstName}{" "}
              {staff.lastName}
            </strong>
            ?
          </p>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              onOpenChange(false)
            }
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            disabled={loading}
            onClick={onConfirm}
          >
            {loading
              ? "Deleting..."
              : "Delete Staff"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}