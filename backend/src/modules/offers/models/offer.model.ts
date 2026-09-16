import {
  Document,
  Model,
  Schema,
  Types,
  model,
} from "mongoose";

export type OfferType =
  | "PERCENTAGE"
  | "FIXED"
  | "BUY_ONE_GET_ONE"
  | "FREE_ITEM";

export type OfferStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "EXPIRED";

export interface IOffer extends Document {
  restaurantId: Types.ObjectId;
  branchId?: Types.ObjectId;

  name: string;
  description?: string;

  type: OfferType;

  value?: number;

  minimumOrderAmount: number;

  maximumDiscountAmount?: number;

  buyQuantity?: number;
  getQuantity?: number;

  freeMenuItemId?: Types.ObjectId;

  applicableMenuItemIds: Types.ObjectId[];
  applicableCategoryIds: Types.ObjectId[];

  validFrom: Date;
  validUntil: Date;

  priority: number;

  status: OfferStatus;

  isActive: boolean;
  isDeleted: boolean;

  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const offerSchema = new Schema<IOffer>(
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

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "PERCENTAGE",
        "FIXED",
        "BUY_ONE_GET_ONE",
        "FREE_ITEM",
      ],
      required: true,
    },

    value: {
      type: Number,
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

    buyQuantity: {
      type: Number,
      min: 1,
    },

    getQuantity: {
      type: Number,
      min: 1,
    },

    freeMenuItemId: {
      type: Schema.Types.ObjectId,
    },

    applicableMenuItemIds: {
      type: [Schema.Types.ObjectId],
      default: [],
    },

    applicableCategoryIds: {
      type: [Schema.Types.ObjectId],
      default: [],
    },

    validFrom: {
      type: Date,
      required: true,
    },

    validUntil: {
      type: Date,
      required: true,
    },

    priority: {
      type: Number,
      default: 0,
      min: 0,
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

offerSchema.index({
  restaurantId: 1,
  branchId: 1,
  status: 1,
  validFrom: 1,
  validUntil: 1,
});

export const Offer: Model<IOffer> =
  model<IOffer>(
    "Offer",
    offerSchema
  );