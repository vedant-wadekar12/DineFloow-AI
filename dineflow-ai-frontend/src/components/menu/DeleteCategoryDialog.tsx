import { AlertTriangle } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import type { MenuCategory } from "@/types/menu.types";

interface DeleteCategoryDialogProps {
  open: boolean;
  category: MenuCategory | null;
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}

export default function DeleteCategoryDialog({
  open,
  category,
  loading = false,
  onOpenChange,
  onConfirm,
}: DeleteCategoryDialogProps) {
  if (!category) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Delete Category
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-3">
          <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-red-500" />

          <div>
            <p className="text-sm">
              Are you sure you want to delete{" "}
              <strong>{category.name}</strong>?
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            disabled={loading}
            onClick={() => void onConfirm()}
          >
            {loading ? "Deleting..." : "Delete Category"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}