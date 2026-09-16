import {
  Schema,
  model,
  Document,
  Types,
} from "mongoose";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "SERVED"
  | "COMPLETED"
  | "CANCELLED";

export type OrderType =
  | "DINE_IN"
  | "TAKEAWAY"
  | "DELIVERY";

export interface IOrderAddon {
  addonId: Types.ObjectId;

  name: string;

  quantity: number;

  unitPrice: number;

  totalPrice: number;
}

export interface IOrderItem {
  menuItemId: Types.ObjectId;

  variantId?: Types.ObjectId;

  name: string;

  variantName?: string;

  quantity: number;

  unitPrice: number;

  addons: IOrderAddon[];

  specialInstructions?: string;

  totalPrice: number;
}

export interface IOrder extends Document {
  restaurantId: Types.ObjectId;

  branchId?: Types.ObjectId;

  customerId?: Types.ObjectId;

  tableId?: Types.ObjectId;

  cartId?: Types.ObjectId;

  orderNumber: string;

  orderType: OrderType;

  status: OrderStatus;

  items: IOrderItem[];

  subtotal: number;

  discountAmount: number;

  taxAmount: number;

  serviceCharge: number;

  totalAmount: number;

  customerNote?: string;

  cancellationReason?: string;

  confirmedAt?: Date;

  preparingAt?: Date;

  readyAt?: Date;

  servedAt?: Date;

  completedAt?: Date;

  cancelledAt?: Date;

  createdBy?: Types.ObjectId;

  updatedBy?: Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;
}

const orderAddonSchema =
  new Schema<IOrderAddon>(
    {
      addonId: {
        type: Schema.Types.ObjectId,
        ref: "MenuAddon",
        required: true,
      },

      name: {
        type: String,
        required: true,
      },

      quantity: {
        type: Number,
        required: true,
        min: 1,
      },

      unitPrice: {
        type: Number,
        required: true,
        min: 0,
      },

      totalPrice: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    {
      _id: false,
    }
  );

const orderItemSchema =
  new Schema<IOrderItem>(
    {
      menuItemId: {
        type: Schema.Types.ObjectId,
        ref: "MenuItem",
        required: true,
      },

      variantId: {
        type: Schema.Types.ObjectId,
        ref: "MenuVariant",
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

      unitPrice: {
        type: Number,
        required: true,
        min: 0,
      },

      addons: {
        type: [orderAddonSchema],
        default: [],
      },

      specialInstructions: {
        type: String,
        maxlength: 500,
      },

      totalPrice: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    {
      _id: true,
    }
  );

const orderSchema =
  new Schema<IOrder>(
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

      customerId: {
        type: Schema.Types.ObjectId,
        ref: "Customer",
        index: true,
      },

      tableId: {
        type: Schema.Types.ObjectId,
        ref: "Table",
        index: true,
      },

      cartId: {
        type: Schema.Types.ObjectId,
        ref: "Cart",
      },

      orderNumber: {
        type: String,
        required: true,
        unique: true,
        index: true,
      },

      orderType: {
        type: String,
        enum: [
          "DINE_IN",
          "TAKEAWAY",
          "DELIVERY",
        ],
        default: "DINE_IN",
      },

      status: {
        type: String,
        enum: [
          "PENDING",
          "CONFIRMED",
          "PREPARING",
          "READY",
          "SERVED",
          "COMPLETED",
          "CANCELLED",
        ],
        default: "PENDING",
        index: true,
      },

      items: {
        type: [orderItemSchema],
        required: true,
        validate: {
          validator: (
            items: IOrderItem[]
          ) => items.length > 0,

          message:
            "Order must contain at least one item",
        },
      },

      subtotal: {
        type: Number,
        default: 0,
        min: 0,
      },

      discountAmount: {
        type: Number,
        default: 0,
        min: 0,
      },

      taxAmount: {
        type: Number,
        default: 0,
        min: 0,
      },

      serviceCharge: {
        type: Number,
        default: 0,
        min: 0,
      },

      totalAmount: {
        type: Number,
        default: 0,
        min: 0,
      },

      customerNote: {
        type: String,
        maxlength: 1000,
      },

      cancellationReason: {
        type: String,
        maxlength: 500,
      },

      confirmedAt: Date,

      preparingAt: Date,

      readyAt: Date,

      servedAt: Date,

      completedAt: Date,

      cancelledAt: Date,

      createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },

      updatedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    },
    {
      timestamps: true,
    }
  );

orderSchema.index({
  restaurantId: 1,
  branchId: 1,
  status: 1,
  createdAt: -1,
});

orderSchema.index({
  tableId: 1,
  createdAt: -1,
});

orderSchema.index({
  customerId: 1,
  createdAt: -1,
});

export const Order = model<IOrder>(
  "Order",
  orderSchema
);