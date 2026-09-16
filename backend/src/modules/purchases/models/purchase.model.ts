import {
  Schema,
  model,
  Document,
  Types,
} from "mongoose";

export type PurchaseStatus =
  | "DRAFT"
  | "ORDERED"
  | "RECEIVED"
  | "PARTIALLY_RECEIVED"
  | "CANCELLED";

export interface IPurchaseItem {
  inventoryItemId: Types.ObjectId;

  quantity: number;

  receivedQuantity: number;

  unitCost: number;

  totalCost: number;

  notes?: string;
}

export interface IPurchase extends Document {
  restaurantId: Types.ObjectId;

  branchId?: Types.ObjectId;

  supplierId: Types.ObjectId;

  purchaseNumber: string;

  purchaseDate: Date;

  expectedDate?: Date;

  status: PurchaseStatus;

  items: IPurchaseItem[];

  subtotal: number;

  taxAmount: number;

  discountAmount: number;

  shippingAmount: number;

  totalAmount: number;

  notes?: string;

  createdBy?: Types.ObjectId;

  updatedBy?: Types.ObjectId;

  receivedBy?: Types.ObjectId;

  receivedAt?: Date;

  createdAt: Date;

  updatedAt: Date;
}

const purchaseItemSchema =
  new Schema<IPurchaseItem>(
    {
      inventoryItemId: {
        type: Schema.Types.ObjectId,
        ref: "InventoryItem",
        required: true,
      },

      quantity: {
        type: Number,
        required: true,
        min: 0.001,
      },

      receivedQuantity: {
        type: Number,
        default: 0,
        min: 0,
      },

      unitCost: {
        type: Number,
        required: true,
        min: 0,
      },

      totalCost: {
        type: Number,
        required: true,
        min: 0,
      },

      notes: {
        type: String,
        trim: true,
      },
    },
    {
      _id: false,
    }
  );

const purchaseSchema =
  new Schema<IPurchase>(
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

      supplierId: {
        type: Schema.Types.ObjectId,
        ref: "Supplier",
        required: true,
        index: true,
      },

      purchaseNumber: {
        type: String,
        required: true,
        unique: true,
        index: true,
      },

      purchaseDate: {
        type: Date,
        default: Date.now,
      },

      expectedDate: Date,

      status: {
        type: String,
        enum: [
          "DRAFT",
          "ORDERED",
          "RECEIVED",
          "PARTIALLY_RECEIVED",
          "CANCELLED",
        ],
        default: "DRAFT",
        index: true,
      },

      items: {
        type: [purchaseItemSchema],
        required: true,
        validate: {
          validator: (items: IPurchaseItem[]) =>
            items.length > 0,
          message:
            "Purchase must contain at least one item",
        },
      },

      subtotal: {
        type: Number,
        default: 0,
        min: 0,
      },

      taxAmount: {
        type: Number,
        default: 0,
        min: 0,
      },

      discountAmount: {
        type: Number,
        default: 0,
        min: 0,
      },

      shippingAmount: {
        type: Number,
        default: 0,
        min: 0,
      },

      totalAmount: {
        type: Number,
        default: 0,
        min: 0,
      },

      notes: {
        type: String,
        trim: true,
      },

      createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },

      updatedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },

      receivedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },

      receivedAt: Date,
    },
    {
      timestamps: true,
    }
  );

purchaseSchema.index({
  restaurantId: 1,
  branchId: 1,
  purchaseDate: -1,
});

purchaseSchema.index({
  supplierId: 1,
  purchaseDate: -1,
});

export const Purchase = model<IPurchase>(
  "Purchase",
  purchaseSchema
);