import { Document, Schema, model } from "mongoose";

export interface IPermission extends Document {
  name: string;

  description: string;

  module: string;

  isActive: boolean;
}

const permissionSchema = new Schema<IPermission>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    module: {
      type: String,
      required: true,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Permission = model<IPermission>(
  "Permission",
  permissionSchema
);