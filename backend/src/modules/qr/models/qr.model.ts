import { Document, Schema, Types, model } from "mongoose";
import { QRType } from "../constants/qr.constants";

export interface IQRCode extends Document {
  restaurantId: Types.ObjectId;
  branchId: Types.ObjectId;
  floorId: Types.ObjectId;
  tableId: Types.ObjectId;
  tableNumber: string;

  type: QRType;

  qrToken: string;
  redirectUrl: string;
  qrImage?: string;

  isActive: boolean;
  isDeleted: boolean;

  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const qrSchema = new Schema<IQRCode>(
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
      required: true,
      index: true,
    },

    floorId: {
      type: Schema.Types.ObjectId,
      ref: "Floor",
      required: true,
      index: true,
    },

    tableId: {
      type: Schema.Types.ObjectId,
      ref: "Table",
      required: true,
      unique: true,
      index: true,
    },

    tableNumber: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["TABLE"],
      default: "TABLE",
      required: true,
    },

    qrToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    redirectUrl: {
      type: String,
      required: true,
      trim: true,
    },

    qrImage: {
      type: String,
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

qrSchema.index({
  restaurantId: 1,
  branchId: 1,
  tableId: 1,
});

export const QRCode = model<IQRCode>(
  "QRCode",
  qrSchema
);