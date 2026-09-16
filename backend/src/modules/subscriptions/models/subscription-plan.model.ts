import {
  Document,
  Model,
  Schema,
  model,
} from "mongoose";

export type SubscriptionBillingCycle =
  | "MONTHLY"
  | "YEARLY";

export interface ISubscriptionPlan
  extends Document {
  name: string;

  code: string;

  description?: string;

  monthlyPrice: number;

  yearlyPrice: number;

  currency: string;

  features: string[];

  limits: {
    branches?: number;
    tables?: number;
    employees?: number;
    menuItems?: number;
    ordersPerMonth?: number;
  };

  isActive: boolean;

  sortOrder: number;

  createdAt: Date;
  updatedAt: Date;
}

const subscriptionPlanSchema =
  new Schema<ISubscriptionPlan>(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
      },

      description: {
        type: String,
        trim: true,
      },

      monthlyPrice: {
        type: Number,
        required: true,
        min: 0,
      },

      yearlyPrice: {
        type: Number,
        required: true,
        min: 0,
      },

      currency: {
        type: String,
        default: "INR",
        uppercase: true,
      },

      features: {
        type: [String],
        default: [],
      },

      limits: {
        branches: Number,
        tables: Number,
        employees: Number,
        menuItems: Number,
        ordersPerMonth: Number,
      },

      isActive: {
        type: Boolean,
        default: true,
      },

      sortOrder: {
        type: Number,
        default: 0,
      },
    },
    {
      timestamps: true,
    }
  );

export const SubscriptionPlan:
  Model<ISubscriptionPlan> =
  model<ISubscriptionPlan>(
    "SubscriptionPlan",
    subscriptionPlanSchema
  );