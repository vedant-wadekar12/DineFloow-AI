import {
  Document,
  Model,
  Schema,
  Types,
  model,
} from "mongoose";

export interface ILoyaltyAccount extends Document {
  restaurantId: Types.ObjectId;
  customerId: Types.ObjectId;

  pointsBalance: number;
  lifetimeEarned: number;
  lifetimeRedeemed: number;

  isActive: boolean;
  isDeleted: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const loyaltyAccountSchema =
  new Schema<ILoyaltyAccount>(
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

      pointsBalance: {
        type: Number,
        min: 0,
        default: 0,
      },

      lifetimeEarned: {
        type: Number,
        min: 0,
        default: 0,
      },

      lifetimeRedeemed: {
        type: Number,
        min: 0,
        default: 0,
      },

      isActive: {
        type: Boolean,
        default: true,
      },

      isDeleted: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );

loyaltyAccountSchema.index(
  {
    restaurantId: 1,
    customerId: 1,
  },
  {
    unique: true,
  }
);

export const LoyaltyAccount: Model<ILoyaltyAccount> =
  model<ILoyaltyAccount>(
    "LoyaltyAccount",
    loyaltyAccountSchema
  );