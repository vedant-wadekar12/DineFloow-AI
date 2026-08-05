import { Document, Schema, Types, model } from "mongoose";

export interface IRefreshToken extends Document {
  userId: Types.ObjectId;
  token: string;
  deviceName?: string;
  deviceId?: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt: Date;
  isRevoked: boolean;
  lastUsedAt?: Date;
}

const refreshTokenSchema = new Schema<IRefreshToken>(
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
    },

    deviceName: String,

    deviceId: String,

    ipAddress: String,

    userAgent: String,

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    isRevoked: {
      type: Boolean,
      default: false,
    },

    lastUsedAt: Date,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/**
 * Automatically remove expired refresh tokens
 */
refreshTokenSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

export const RefreshToken = model<IRefreshToken>(
  "RefreshToken",
  refreshTokenSchema
);