import {
  AlertTriangle,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import type {
  Restaurant,
} from "@/types/restaurant.types";

interface DeleteRestaurantDialogProps {
  restaurant: Restaurant | null;
  open: boolean;
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}

function DeleteRestaurantDialog({
  restaurant,
  open,
  loading,
  onOpenChange,
  onConfirm,
}: DeleteRestaurantDialogProps) {
  if (!restaurant) {
    return null;
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>

          <AlertDialogTitle>
            Delete restaurant?
          </AlertDialogTitle>

          <AlertDialogDescription>
            You're about to delete{" "}
            <strong>
              {restaurant.name}
            </strong>
            . This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={loading}
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={loading}
            onClick={async (event) => {
              event.preventDefault();

              await onConfirm();
            }}
            className="bg-red-500 hover:bg-red-600"
          >
            {loading
              ? "Deleting..."
              : "Delete Restaurant"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteRestaurantDialog;