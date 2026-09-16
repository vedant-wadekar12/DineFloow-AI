import {
  Document,
  Model,
  Schema,
  Types,
  model,
} from "mongoose";

export type CouponDiscountType =
  | "PERCENTAGE"
  | "FIXED";

export type CouponStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "EXPIRED";

export interface ICoupon extends Document {
  restaurantId: Types.ObjectId;
  branchId?: Types.ObjectId;

  code: string;
  name: string;
  description?: string;

  discountType: CouponDiscountType;
  discountValue: number;

  minimumOrderAmount: number;
  maximumDiscountAmount?: number;

  usageLimit?: number;
  usageCount: number;

  perCustomerLimit?: number;

  validFrom: Date;
  validUntil: Date;

  status: CouponStatus;

  applicableMenuItemIds: Types.ObjectId[];
  applicableCategoryIds: Types.ObjectId[];

  isActive: boolean;
  isDeleted: boolean;

  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const couponSchema = new Schema<ICoupon>(
  {
    restaurantId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    branchId: {
      type: Schema.Types.ObjectId,
      index: true,
    },

    code: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    discountType: {
      type: String,
      enum: ["PERCENTAGE", "FIXED"],
      required: true,
    },

    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },

    minimumOrderAmount: {
      type: Number,
      min: 0,
      default: 0,
    },

    maximumDiscountAmount: {
      type: Number,
      min: 0,
    },

    usageLimit: {
      type: Number,
      min: 1,
    },

    usageCount: {
      type: Number,
      min: 0,
      default: 0,
    },

    perCustomerLimit: {
      type: Number,
      min: 1,
    },

    validFrom: {
      type: Date,
      required: true,
    },

    validUntil: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "ACTIVE",
        "INACTIVE",
        "EXPIRED",
      ],
      default: "ACTIVE",
      index: true,
    },

    applicableMenuItemIds: {
      type: [Schema.Types.ObjectId],
      default: [],
    },

    applicableCategoryIds: {
      type: [Schema.Types.ObjectId],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
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

couponSchema.index(
  {
    restaurantId: 1,
    branchId: 1,
    code: 1,
  },
  {
    unique: true,
  }
);

couponSchema.index({
  restaurantId: 1,
  status: 1,
  validFrom: 1,
  validUntil: 1,
});

export const Coupon: Model<ICoupon> =
  model<ICoupon>(
    "Coupon",
    couponSchema
  );