import { Schema, model, Document, Types } from "mongoose";

export interface ISupplier extends Document {
  restaurantId: Types.ObjectId;
  branchId?: Types.ObjectId;

  name: string;
  companyName?: string;

  email?: string;
  phone: string;

  address?: string;
  city?: string;
  state?: string;
  pincode?: string;

  gstNumber?: string;

  contactPerson?: string;

  notes?: string;

  isActive: boolean;
  isDeleted: boolean;

  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const supplierSchema = new Schema<ISupplier>(
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

    companyName: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      trim: true,
    },

    state: {
      type: String,
      trim: true,
    },

    pincode: {
      type: String,
      trim: true,
    },

    gstNumber: {
      type: String,
      trim: true,
      uppercase: true,
    },

    contactPerson: {
      type: String,
      trim: true,
    },

    notes: {
      type: String,
      trim: true,
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
  }
);

supplierSchema.index({
  restaurantId: 1,
  branchId: 1,
  name: 1,
});

supplierSchema.index({
  restaurantId: 1,
  gstNumber: 1,
});

export const Supplier = model<ISupplier>("Supplier", supplierSchema);