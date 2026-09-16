import {
  Document,
  Model,
  Schema,
  Types,
  model,
} from "mongoose";

export type LoyaltyTransactionType =
  | "EARN"
  | "REDEEM"
  | "BONUS"
  | "ADJUSTMENT"
  | "EXPIRE"
  | "REVERSAL";

export interface ILoyaltyTransaction
  extends Document {
  restaurantId: Types.ObjectId;
  customerId: Types.ObjectId;
  loyaltyAccountId: Types.ObjectId;

  type: LoyaltyTransactionType;

  points: number;

  balanceBefore: number;
  balanceAfter: number;

  orderId?: Types.ObjectId;

  reason?: string;

  expiresAt?: Date;

  createdBy?: Types.ObjectId;

  createdAt: Date;
}

const loyaltyTransactionSchema =
  new Schema<ILoyaltyTransaction>(
    {
      restaurantId: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
      },

      customerId: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
      },

      loyaltyAccountId: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
      },

      type: {
        type: String,
        enum: [
          "EARN",
          "REDEEM",
          "BONUS",
          "ADJUSTMENT",
          "EXPIRE",
          "REVERSAL",
        ],
        required: true,
      },

      points: {
        type: Number,
        required: true,
        min: 0,
      },

      balanceBefore: {
        type: Number,
        required: true,
        min: 0,
      },

      balanceAfter: {
        type: Number,
        required: true,
        min: 0,
      },

      orderId: {
        type: Schema.Types.ObjectId,
      },

      reason: {
        type: String,
        trim: true,
      },

      expiresAt: Date,

      createdBy: {
        type: Schema.Types.ObjectId,
      },
    },
    {
      timestamps: {
        createdAt: true,
        updatedAt: false,
      },
    }
  );

loyaltyTransactionSchema.index({
  customerId: 1,
  createdAt: -1,
});

export const LoyaltyTransaction:
  Model<ILoyaltyTransaction> =
  model<ILoyaltyTransaction>(
    "LoyaltyTransaction",
    loyaltyTransactionSchema
  );