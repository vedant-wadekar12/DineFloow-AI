import { Document, Schema, Types, model } from "mongoose";

export interface IMenuAddon extends Document {
  restaurantId: Types.ObjectId;
  branchId?: Types.ObjectId;

  name: string;
  description?: string;

  price: number;

  isAvailable: boolean;
  isActive: boolean;
  isDeleted: boolean;

  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const menuAddonSchema = new Schema<IMenuAddon>(
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

    description: {
      type: String,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
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

menuAddonSchema.index(
  {
    restaurantId: 1,
    branchId: 1,
    name: 1,
  },
  {
    unique: true,
  }
);

export const MenuAddon = model<IMenuAddon>(
  "MenuAddon",
  menuAddonSchema
);