import {
  Schema,
  model,
  Document,
  Types,
} from "mongoose";

export type KitchenTicketStatus =
  | "QUEUED"
  | "ACCEPTED"
  | "PREPARING"
  | "READY"
  | "CANCELLED";

export interface IKitchenTicketItem {
  orderItemId: Types.ObjectId;

  menuItemId: Types.ObjectId;

  name: string;

  variantName?: string;

  quantity: number;

  specialInstructions?: string;

  addons: {
    name: string;
    quantity: number;
  }[];
}

export interface IKitchenTicket extends Document {
  restaurantId: Types.ObjectId;

  branchId?: Types.ObjectId;

  orderId: Types.ObjectId;

  tableId?: Types.ObjectId;

  ticketNumber: string;

  items: IKitchenTicketItem[];

  status: KitchenTicketStatus;

  priority: number;

  assignedChefId?: Types.ObjectId;

  acceptedAt?: Date;

  startedAt?: Date;

  readyAt?: Date;

  cancelledAt?: Date;

  cancellationReason?: string;

  createdAt: Date;

  updatedAt: Date;
}

const kitchenAddonSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    _id: false,
  }
);

const kitchenTicketItemSchema =
  new Schema<IKitchenTicketItem>(
    {
      orderItemId: {
        type: Schema.Types.ObjectId,
        required: true,
      },

      menuItemId: {
        type: Schema.Types.ObjectId,
        ref: "MenuItem",
        required: true,
      },

      name: {
        type: String,
        required: true,
      },

      variantName: String,

      quantity: {
        type: Number,
        required: true,
        min: 1,
      },

      specialInstructions: {
        type: String,
        maxlength: 500,
      },

      addons: {
        type: [kitchenAddonSchema],
        default: [],
      },
    },
    {
      _id: false,
    }
  );

const kitchenTicketSchema =
  new Schema<IKitchenTicket>(
    {
      restaurantId: {
        type: Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
        index: true,
      },

      branchId: {
        type: Schema.Types.ObjectId,
        ref: "Branch",
        index: true,
      },

      orderId: {
        type: Schema.Types.ObjectId,
        ref: "Order",
        required: true,
        unique: true,
        index: true,
      },

      tableId: {
        type: Schema.Types.ObjectId,
        ref: "Table",
        index: true,
      },

      ticketNumber: {
        type: String,
        required: true,
        unique: true,
        index: true,
      },

      items: {
        type: [kitchenTicketItemSchema],
        required: true,
        validate: {
          validator: (
            items: IKitchenTicketItem[]
          ) => items.length > 0,
          message:
            "Kitchen ticket must contain at least one item",
        },
      },

      status: {
        type: String,
        enum: [
          "QUEUED",
          "ACCEPTED",
          "PREPARING",
          "READY",
          "CANCELLED",
        ],
        default: "QUEUED",
        index: true,
      },

      priority: {
        type: Number,
        default: 0,
        min: 0,
      },

      assignedChefId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },

      acceptedAt: Date,

      startedAt: Date,

      readyAt: Date,

      cancelledAt: Date,

      cancellationReason: {
        type: String,
        maxlength: 500,
      },
    },
    {
      timestamps: true,
    }
  );

kitchenTicketSchema.index({
  restaurantId: 1,
  branchId: 1,
  status: 1,
  priority: -1,
  createdAt: 1,
});

export const KitchenTicket =
  model<IKitchenTicket>(
    "KitchenTicket",
    kitchenTicketSchema
  );