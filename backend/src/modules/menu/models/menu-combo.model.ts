import { Document, Schema, Types, model } from "mongoose";

export interface IMenuCombo extends Document {
  restaurantId: Types.ObjectId;
  branchId?: Types.ObjectId;

  name: string;
  slug: string;
  description?: string;
  image?: string;

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

const menuComboSchema = new Schema<IMenuCombo>(
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

    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    image: {
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

menuComboSchema.index(
  {
    restaurantId: 1,
    branchId: 1,
    slug: 1,
  },
  {
    unique: true,
  }
);

export const MenuCombo = model<IMenuCombo>(
  "MenuCombo",
  menuComboSchema
);