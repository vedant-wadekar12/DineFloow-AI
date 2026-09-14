import { useEffect } from "react";

import {
  useFieldArray,
  useForm,
} from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type {
  Order,
} from "@/types/order.types";

const orderSchema = z.object({
  customerName:
    z.string().optional(),

  customerPhone:
    z.string().optional(),

  orderType: z.enum([
    "dine-in",
    "takeaway",
    "delivery",
  ]),

  tableId:
    z.string().optional(),

  discount: z.coerce
    .number()
    .min(0)
    .default(0),

  tax: z.coerce
    .number()
    .min(0)
    .default(0),

  notes:
    z.string().optional(),

  items: z
    .array(
      z.object({
        menuItemId:
          z.string().min(
            1,
            "Menu item is required",
          ),

        menuItemName:
          z.string().min(
            1,
            "Item name is required",
          ),

        quantity: z.coerce
          .number()
          .positive(
            "Quantity must be greater than zero",
          ),

        price: z.coerce
          .number()
          .min(
            0,
            "Price cannot be negative",
          ),

        notes:
          z.string().optional(),
      }),
    )
    .min(
      1,
      "At least one item is required",
    ),
});

type OrderFormInput = z.input<typeof orderSchema>;
type OrderFormValues = z.output<typeof orderSchema>;

interface OrderFormDialogProps {
  open: boolean;
  order: Order | null;
  loading?: boolean;

  onOpenChange: (
    open: boolean,
  ) => void;

  onSubmit: (
    values: OrderFormValues,
  ) => Promise<void>;
}

export default function OrderFormDialog({
  open,
  order,
  loading = false,
  onOpenChange,
  onSubmit,
}: OrderFormDialogProps) {
  const form = useForm<
  OrderFormInput,
  unknown,
  OrderFormValues
>({
  resolver: zodResolver(
    orderSchema
  ),
      defaultValues: {
        customerName: "",
        customerPhone: "",
        orderType: "dine-in",
        tableId: "",
        discount: 0,
        tax: 0,
        notes: "",
        items: [
          {
            menuItemId: "",
            menuItemName: "",
            quantity: 1,
            price: 0,
            notes: "",
          },
        ],
      },
    });

  const { fields, append, remove } =
    useFieldArray({
      control: form.control,
      name: "items",
    });

  useEffect(() => {
    if (order) {
      form.reset({
        customerName:
          order.customerName ??
          "",

        customerPhone:
          order.customerPhone ??
          "",

        orderType:
          order.orderType,

        tableId:
          order.tableId ?? "",

        discount:
          order.discount,

        tax:
          order.tax,

        notes:
          order.notes ?? "",

        items: order.items.map(
          (item) => ({
            menuItemId:
              item.menuItemId,

            menuItemName:
              item.menuItemName,

            quantity:
              item.quantity,

            price:
              item.price,

            notes:
              item.notes ?? "",
          }),
        ),
      });
    } else {
      form.reset({
        customerName: "",
        customerPhone: "",
        orderType: "dine-in",
        tableId: "",
        discount: 0,
        tax: 0,
        notes: "",
        items: [
          {
            menuItemId: "",
            menuItemName: "",
            quantity: 1,
            price: 0,
            notes: "",
          },
        ],
      });
    }
  }, [order, open, form]);

  const submit = async (
    values: OrderFormValues,
  ) => {
    await onSubmit(values);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {order
              ? "Edit Order"
              : "Create Order"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(
            submit,
          )}
          className="space-y-6"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>
                Customer Name
              </Label>

              <Input
                {...form.register(
                  "customerName",
                )}
                placeholder="Guest"
              />
            </div>

            <div className="space-y-2">
              <Label>
                Customer Phone
              </Label>

              <Input
                {...form.register(
                  "customerPhone",
                )}
                placeholder="Phone number"
              />
            </div>

            <div className="space-y-2">
              <Label>
                Order Type
              </Label>

              <select
                {...form.register(
                  "orderType",
                )}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              >
                <option value="dine-in">
                  Dine In
                </option>

                <option value="takeaway">
                  Takeaway
                </option>

                <option value="delivery">
                  Delivery
                </option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>
                Table ID
              </Label>

              <Input
                {...form.register(
                  "tableId",
                )}
                placeholder="Table ID"
              />
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">
                Order Items
              </h3>

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  append({
                    menuItemId: "",
                    menuItemName:
                      "",
                    quantity: 1,
                    price: 0,
                    notes: "",
                  })
                }
              >
                Add Item
              </Button>
            </div>

            <div className="space-y-4">
              {fields.map(
                (field, index) => (
                  <div
                    key={field.id}
                    className="rounded-lg border p-4"
                  >
                    <div className="grid gap-3 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label>
                          Menu Item ID
                        </Label>

                        <Input
                          {...form.register(
                            `items.${index}.menuItemId`,
                          )}
                          placeholder="Menu item ID"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>
                          Item Name
                        </Label>

                        <Input
                          {...form.register(
                            `items.${index}.menuItemName`,
                          )}
                          placeholder="Paneer Pizza"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>
                          Quantity
                        </Label>

                        <Input
                          type="number"
                          min="1"
                          {...form.register(
                            `items.${index}.quantity`,
                          )}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>
                          Price
                        </Label>

                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          {...form.register(
                            `items.${index}.price`,
                          )}
                        />
                      </div>
                    </div>

                    <div className="mt-3 flex justify-end">
                      {fields.length >
                        1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            remove(
                              index,
                            )
                          }
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>
                Discount
              </Label>

              <Input
                type="number"
                min="0"
                step="0.01"
                {...form.register(
                  "discount",
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>
                Tax
              </Label>

              <Input
                type="number"
                min="0"
                step="0.01"
                {...form.register(
                  "tax",
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>
              Notes
            </Label>

            <Input
              {...form.register(
                "notes",
              )}
              placeholder="Special instructions"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() =>
                onOpenChange(false)
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : order
                  ? "Update Order"
                  : "Create Order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}