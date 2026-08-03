import { Document, Schema, model } from "mongoose";

export interface IRole extends Document {
  name: string;

  description: string;

  isSystem: boolean;

  isActive: boolean;
}

const roleSchema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    isSystem: {
      type: Boolean,
      default: true,
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

export const Role = model<IRole>("Role", roleSchema);