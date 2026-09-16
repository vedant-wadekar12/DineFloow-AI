import {
  Document,
  Schema,
  Types,
  model,
} from "mongoose";

import {
  StockTransactionType,
} from "../constants/inventory.constants";

export interface IStockTransaction
  extends Document {
  inventoryItemId: Types.ObjectId;

  restaurantId: Types.ObjectId;
  branchId?: Types.ObjectId;

  type: StockTransactionType;

  quantity: number;

  previousStock: number;
  newStock: number;

  reason?: string;

  referenceType?: string;
  referenceId?: Types.ObjectId;

  createdBy?: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const stockTransactionSchema =
  new Schema<IStockTransaction>(
    {
      inventoryItemId: {
        type: Schema.Types.ObjectId,
        ref: "InventoryItem",
        required: true,
        index: true,
      },

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

      type: {
        type: String,
        enum: [
          "PURCHASE",
          "CONSUMPTION",
          "ADJUSTMENT",
          "WASTE",
          "RETURN",
        ],
        required: true,
      },

      quantity: {
        type: Number,
        required: true,
        min: 0,
      },

      previousStock: {
        type: Number,
        required: true,
        min: 0,
      },

      newStock: {
        type: Number,
        required: true,
        min: 0,
      },

      reason: {
        type: String,
        trim: true,
      },

      referenceType: {
        type: String,
        trim: true,
      },

      referenceId: {
        type: Schema.Types.ObjectId,
      },

      createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    },
    {
      timestamps: true,
      versionKey: false,
    }
  );

stockTransactionSchema.index({
  inventoryItemId: 1,
  createdAt: -1,
});

export const StockTransaction =
  model<IStockTransaction>(
    "StockTransaction",
    stockTransactionSchema
  );