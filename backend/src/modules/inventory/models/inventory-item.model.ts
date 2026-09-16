import {
  Document,
  Schema,
  Types,
  model,
} from "mongoose";

import {
  InventoryType,
  InventoryUnit,
} from "../constants/inventory.constants";

export interface IInventoryItem extends Document {
  restaurantId: Types.ObjectId;
  branchId?: Types.ObjectId;

  name: string;
  sku: string;

  type: InventoryType;
  unit: InventoryUnit;

  currentStock: number;
  minimumStock: number;
  maximumStock?: number;

  costPrice: number;

  supplierId?: Types.ObjectId;

  description?: string;

  isActive: boolean;
  isDeleted: boolean;

  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const inventoryItemSchema =
  new Schema<IInventoryItem>(
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

      name: {
        type: String,
        required: true,
        trim: true,
      },

      sku: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
      },

      type: {
        type: String,
        enum: [
          "RAW_MATERIAL",
          "PACKAGING",
          "BEVERAGE",
          "OTHER",
        ],
        default: "RAW_MATERIAL",
      },

      unit: {
        type: String,
        enum: [
          "KG",
          "G",
          "L",
          "ML",
          "PCS",
          "PACK",
          "BOX",
          "BOTTLE",
        ],
        required: true,
      },

      currentStock: {
        type: Number,
        default: 0,
        min: 0,
      },

      minimumStock: {
        type: Number,
        default: 0,
        min: 0,
      },

      maximumStock: {
        type: Number,
        min: 0,
      },

      costPrice: {
        type: Number,
        default: 0,
        min: 0,
      },

      supplierId: {
        type: Schema.Types.ObjectId,
        ref: "Supplier",
        index: true,
      },

      description: {
        type: String,
        trim: true,
      },

      isActive: {
        type: Boolean,
        default: true,
      },

      isDeleted: {
        type: Boolean,
        default: false,
      },

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
      versionKey: false,
    }
  );

inventoryItemSchema.index(
  {
    restaurantId: 1,
    sku: 1,
  },
  {
    unique: true,
  }
);

inventoryItemSchema.index({
  restaurantId: 1,
  branchId: 1,
  currentStock: 1,
});

export const InventoryItem =
  model<IInventoryItem>(
    "InventoryItem",
    inventoryItemSchema
  );