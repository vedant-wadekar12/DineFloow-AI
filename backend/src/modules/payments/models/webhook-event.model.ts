import { Document, Schema, Types, model } from "mongoose";

import { tenantPlugin } from "../../../common/tenant/tenant-plugin";
export interface IWebhookEvent extends Document {
  eventId: string;
  provider: string;
  eventType: string;
  restaurantId?: Types.ObjectId;
  paymentId?: Types.ObjectId;
  orderId?: Types.ObjectId;
  status: "PROCESSED" | "FAILED" | "DUPLICATE";
  payload?: Record<string, unknown>;
  processedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const webhookEventSchema = new Schema<IWebhookEvent>(
  {
    eventId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    provider: {
      type: String,
      required: true,
      trim: true,
    },
    eventType: {
      type: String,
      required: true,
      trim: true,
    },
    restaurantId: {
      type: Schema.Types.ObjectId,
      index: true,
    },
    paymentId: {
      type: Schema.Types.ObjectId,
      index: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      index: true,
    },
    status: {
      type: String,
      enum: ["PROCESSED", "FAILED", "DUPLICATE"],
      default: "PROCESSED",
    },
    payload: {
      type: Schema.Types.Mixed,
    },
    processedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

webhookEventSchema.plugin(tenantPlugin);

export const WebhookEvent = model<IWebhookEvent>(
  "WebhookEvent",
  webhookEventSchema
);
