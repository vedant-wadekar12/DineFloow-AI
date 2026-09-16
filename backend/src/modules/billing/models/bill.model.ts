import { Document, Model, Schema, Types, model } from "mongoose";

export type BillStatus =
  | "DRAFT"
  | "ISSUED"
  | "PARTIALLY_PAID"
  | "PAID"
  | "CANCELLED"
  | "REFUNDED";

export interface IBillItem {
  orderItemId: Types.ObjectId;
  menuItemId: Types.ObjectId;
  name: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface IBill extends Document {
  billNumber: string;

  restaurantId: Types.ObjectId;
  branchId?: Types.ObjectId;
  orderId: Types.ObjectId;
  tableId?: Types.ObjectId;
  customerId?: Types.ObjectId;

  items: IBillItem[];

  subtotal: number;
  discount: number;
  tax: number;
  serviceCharge: number;
  grandTotal: number;

  paidAmount: number;
  dueAmount: number;

  status: BillStatus;

  notes?: string;

  issuedAt?: Date;
  paidAt?: Date;
  cancelledAt?: Date;

  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const billItemSchema = new Schema<IBillItem>(
  {
    orderItemId: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    menuItemId: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    variantName: {
      type: String,
      trim: true,
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
  { _id: false }
);

const billSchema = new Schema<IBill>(
  {
    billNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    restaurantId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    branchId: {
      type: Schema.Types.ObjectId,
      index: true,
    },

    orderId: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      index: true,
    },

    tableId: {
      type: Schema.Types.ObjectId,
      index: true,
    },

    customerId: {
      type: Schema.Types.ObjectId,
      index: true,
    },

    items: {
      type: [billItemSchema],
      required: true,
      default: [],
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    tax: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    serviceCharge: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    grandTotal: {
      type: Number,
      required: true,
      min: 0,
    },

    paidAmount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    dueAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "DRAFT",
        "ISSUED",
        "PARTIALLY_PAID",
        "PAID",
        "CANCELLED",
        "REFUNDED",
      ],
      default: "DRAFT",
      index: true,
    },

    notes: {
      type: String,
      trim: true,
    },

    issuedAt: Date,
    paidAt: Date,
    cancelledAt: Date,

    createdBy: {
      type: Schema.Types.ObjectId,
    },

    updatedBy: {
      type: Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);

billSchema.index({
  restaurantId: 1,
  branchId: 1,
  createdAt: -1,
});

billSchema.index({
  restaurantId: 1,
  status: 1,
});

export const Bill: Model<IBill> = model<IBill>(
  "Bill",
  billSchema
);