import { Document, Schema, Types, model } from "mongoose";

export interface IMenuVariant extends Document {
  menuItemId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  branchId?: Types.ObjectId;

  name: string;
  description?: string;

  price: number;
  discountPrice?: number;

  isAvailable: boolean;
  isActive: boolean;
  isDeleted: boolean;

  sortOrder: number;

  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const menuVariantSchema = new Schema<IMenuVariant>(
  {
    menuItemId: {
      type: Schema.Types.ObjectId,
      ref: "MenuItem",
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

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    discountPrice: {
      type: Number,
      min: 0,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    sortOrder: {
      type: Number,
      default: 0,
      min: 0,
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

menuVariantSchema.index(
  {
    menuItemId: 1,
    name: 1,
  },
  {
    unique: true,
  }
);

export const MenuVariant = model<IMenuVariant>(
  "MenuVariant",
  menuVariantSchema
);