import { Document, model, Schema, Types } from "mongoose";

export interface IRestaurantSettings extends Document {
  restaurantId: Types.ObjectId;

  currency: string;
  timezone: string;
  language: string;

  taxEnabled: boolean;
  taxPercentage: number;

  serviceChargeEnabled: boolean;
  serviceChargePercentage: number;

  orderSettings: {
    allowDineIn: boolean;
    allowTakeaway: boolean;
    allowDelivery: boolean;
    allowOnlineOrdering: boolean;
    allowCashPayment: boolean;
    allowOnlinePayment: boolean;
  };

  notificationSettings: {
    orderNotifications: boolean;
    paymentNotifications: boolean;
    lowStockNotifications: boolean;
    marketingNotifications: boolean;
  };

  loyaltySettings: {
    enabled: boolean;
    pointsPerCurrency: number;
  };

  isActive: boolean;

  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const restaurantSettingsSchema =
  new Schema<IRestaurantSettings>(
    {
      restaurantId: {
        type: Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
        unique: true,
        index: true,
      },

      currency: {
        type: String,
        default: "INR",
        trim: true,
      },

      timezone: {
        type: String,
        default: "Asia/Kolkata",
        trim: true,
      },

      language: {
        type: String,
        default: "en",
        trim: true,
      },

      taxEnabled: {
        type: Boolean,
        default: true,
      },

      taxPercentage: {
        type: Number,
        default: 0,
        min: 0,
      },

      serviceChargeEnabled: {
        type: Boolean,
        default: false,
      },

      serviceChargePercentage: {
        type: Number,
        default: 0,
        min: 0,
      },

      orderSettings: {
        allowDineIn: {
          type: Boolean,
          default: true,
        },

        allowTakeaway: {
          type: Boolean,
          default: true,
        },

        allowDelivery: {
          type: Boolean,
          default: false,
        },

        allowOnlineOrdering: {
          type: Boolean,
          default: true,
        },

        allowCashPayment: {
          type: Boolean,
          default: true,
        },

        allowOnlinePayment: {
          type: Boolean,
          default: true,
        },
      },

      notificationSettings: {
        orderNotifications: {
          type: Boolean,
          default: true,
        },

        paymentNotifications: {
          type: Boolean,
          default: true,
        },

        lowStockNotifications: {
          type: Boolean,
          default: true,
        },

        marketingNotifications: {
          type: Boolean,
          default: false,
        },
      },

      loyaltySettings: {
        enabled: {
          type: Boolean,
          default: false,
        },

        pointsPerCurrency: {
          type: Number,
          default: 1,
          min: 0,
        },
      },

      isActive: {
        type: Boolean,
        default: true,
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
    }
  );

export const RestaurantSettings =
  model<IRestaurantSettings>(
    "RestaurantSettings",
    restaurantSettingsSchema
  );