import {
  Schema,
  model,
  Document,
  Types,
} from "mongoose";

export interface ICartItem {
  _id?: Types.ObjectId;
  menuItemId: Types.ObjectId;
  variantId?: Types.ObjectId;
  quantity: number;

  unitPrice: number;

  selectedAddons?: {
    addonId: Types.ObjectId;
    quantity: number;
    unitPrice: number;
  }[];

  specialInstructions?: string;

  totalPrice: number;
}

export interface ICart extends Document {
  restaurantId: Types.ObjectId;
  branchId?: Types.ObjectId;

  customerId?: Types.ObjectId;

  tableId?: Types.ObjectId;

  sessionId: string;

  items: ICartItem[];

  subtotal: number;

  discountAmount: number;

  taxAmount: number;

  totalAmount: number;

  isActive: boolean;

  expiresAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const cartAddonSchema = new Schema(
  {
    addonId: {
      type: Schema.Types.ObjectId,
      ref: "MenuAddon",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

const cartItemSchema = new Schema<ICartItem>(
  {
    menuItemId: {
      type: Schema.Types.ObjectId,
      ref: "MenuItem",
      required: true,
    },

    variantId: {
      type: Schema.Types.ObjectId,
      ref: "MenuVariant",
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    selectedAddons: {
      type: [cartAddonSchema],
      default: [],
    },

    specialInstructions: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: true,
  }
);

const cartSchema = new Schema<ICart>(
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

    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      index: true,
    },

    tableId: {
      type: Schema.Types.ObjectId,
      ref: "Table",
      index: true,
    },

    sessionId: {
      type: String,
      required: true,
      index: true,
    },

    items: {
      type: [cartItemSchema],
      default: [],
    },

    subtotal: {
      type: Number,
      default: 0,
      min: 0,
    },

    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    taxAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    expiresAt: Date,
  },
  {
    timestamps: true,
  }
);

cartSchema.index({
  restaurantId: 1,
  branchId: 1,
  sessionId: 1,
  isActive: 1,
});

export const Cart = model<ICart>(
  "Cart",
  cartSchema
);