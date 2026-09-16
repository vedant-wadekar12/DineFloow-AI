import {
  Document,
  Model,
  Schema,
  Types,
  model,
} from "mongoose";

export type SubscriptionStatus =
  | "TRIAL"
  | "ACTIVE"
  | "PAST_DUE"
  | "CANCELLED"
  | "EXPIRED";

export type SubscriptionBillingCycle =
  | "MONTHLY"
  | "YEARLY";

export interface ISubscription
  extends Document {
  restaurantId: Types.ObjectId;

  planId: Types.ObjectId;

  status: SubscriptionStatus;

  billingCycle:
    SubscriptionBillingCycle;

  startDate: Date;

  currentPeriodStart: Date;

  currentPeriodEnd: Date;

  trialEndsAt?: Date;

  cancelledAt?: Date;

  cancelAtPeriodEnd: boolean;

  paymentId?: Types.ObjectId;

  externalSubscriptionId?: string;

  createdBy?: Types.ObjectId;

  updatedBy?: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema =
  new Schema<ISubscription>(
    {
      restaurantId: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
      },

      planId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "SubscriptionPlan",
      },

      status: {
        type: String,
        enum: [
          "TRIAL",
          "ACTIVE",
          "PAST_DUE",
          "CANCELLED",
          "EXPIRED",
        ],
        default: "TRIAL",
        index: true,
      },

      billingCycle: {
        type: String,
        enum: [
          "MONTHLY",
          "YEARLY",
        ],
        required: true,
      },

      startDate: {
        type: Date,
        required: true,
      },

      currentPeriodStart: {
        type: Date,
        required: true,
      },

      currentPeriodEnd: {
        type: Date,
        required: true,
      },

      trialEndsAt: Date,

      cancelledAt: Date,

      cancelAtPeriodEnd: {
        type: Boolean,
        default: false,
      },

      paymentId: {
        type: Schema.Types.ObjectId,
        ref: "Payment",
      },

      externalSubscriptionId: {
        type: String,
        trim: true,
      },

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

subscriptionSchema.index(
  {
    restaurantId: 1,
  },
  {
    unique: true,
  }
);

export const Subscription:
  Model<ISubscription> =
  model<ISubscription>(
    "Subscription",
    subscriptionSchema
  );