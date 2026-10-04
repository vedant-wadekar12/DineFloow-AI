import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type {
  Restaurant,
} from "@/types/restaurant.types";

import RestaurantForm, {
  type RestaurantFormValues,
} from "./RestaurantForm";

interface RestaurantDialogProps {
  open: boolean;
  restaurant: Restaurant | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    data: RestaurantFormValues,
  ) => Promise<void>;
}

function RestaurantDialog({
  open,
  restaurant,
  onOpenChange,
  onSubmit,
}: RestaurantDialogProps) {
  const isEditing = Boolean(restaurant);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? "Edit Restaurant"
              : "Create Restaurant"}
          </DialogTitle>

          <DialogDescription>
            {isEditing
              ? "Update your restaurant information."
              : "Add a new restaurant to your DineFlow workspace."}
          </DialogDescription>
        </DialogHeader>

        <RestaurantForm
          restaurant={restaurant}
          onSubmit={onSubmit}
          onCancel={() =>
            onOpenChange(false)
          }
        />
      </DialogContent>
    </Dialog>
  );
}

export default RestaurantDialog;