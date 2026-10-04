import { Document, Schema, Types, model } from "mongoose";

export interface IFloor extends Document {
  restaurantId: Types.ObjectId;
  branchId: Types.ObjectId;
  name: string;
  code: string;
  description?: string;
  floorNumber: number;
  isActive: boolean;
  isDeleted: boolean;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
}

const floorSchema = new Schema<IFloor>(
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
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true, uppercase: true },
    description: { type: String, trim: true },
    floorNumber: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, versionKey: false }
);

floorSchema.index({ restaurantId: 1, branchId: 1, code: 1 }, { unique: true });

import { tenantPlugin } from "../../../common/tenant/tenant-plugin";
floorSchema.plugin(tenantPlugin);

export const Floor = model<IFloor>("Floor", floorSchema);
