import { Schema, model, Types, Document } from "mongoose";

export type MenuItemType =
  | "FOOD"
  | "BEVERAGE"
  | "DESSERT"
  | "OTHER";

export interface IMenuItem extends Document {
  restaurantId: Types.ObjectId;
  branchId?: Types.ObjectId;
  categoryId: Types.ObjectId;

  name: string;
  slug: string;
  description?: string;

  type: MenuItemType;

  price: number;
  discountPrice?: number;

  image?: string;

  isVegetarian: boolean;
  isVegan: boolean;

  preparationTime?: number;
  sortOrder: number;

  isAvailable: boolean;
  isActive: boolean;
  isDeleted: boolean;

  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
}

const menuItemSchema = new Schema<IMenuItem>(
  {
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },

    branchId: {
      type: Schema.Types.ObjectId,
      ref: "Branch",
    },

    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
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

    type: {
      type: String,
      enum: [
        "FOOD",
        "BEVERAGE",
        "DESSERT",
        "OTHER",
      ],
      required: true,
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

    image: {
      type: String,
      trim: true,
    },

    isVegetarian: {
      type: Boolean,
      default: false,
    },

    isVegan: {
      type: Boolean,
      default: false,
    },

    preparationTime: {
      type: Number,
      min: 0,
    },

    sortOrder: {
      type: Number,
      default: 0,
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

menuItemSchema.index(
  {
    restaurantId: 1,
    branchId: 1,
    slug: 1,
  },
  {
    unique: true,
  }
);

export const MenuItem = model<IMenuItem>(
  "MenuItem",
  menuItemSchema
);