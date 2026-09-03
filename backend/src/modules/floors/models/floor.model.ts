import { Document, Schema, Types, model } from "mongoose";

export interface IFloor extends Document {
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
    branchId: {
      type: Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    description: {
      type: String,
      trim: true,
    },

    floorNumber: {
      type: Number,
      required: true,
      min: 0,
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

floorSchema.index(
  { branchId: 1, code: 1 },
  { unique: true }
);

export const Floor = model<IFloor>(
  "Floor",
  floorSchema
);