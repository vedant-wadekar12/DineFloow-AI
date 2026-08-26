import { Document, Schema, Types, model } from "mongoose";

export interface IPasswordReset extends Document {
  userId: Types.ObjectId;
  token: string;
  expiresAt: Date;
  used: boolean;
}

const passwordResetSchema = new Schema<IPasswordReset>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    used: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

passwordResetSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

export const PasswordReset = model<IPasswordReset>(
  "PasswordReset",
  passwordResetSchema
);