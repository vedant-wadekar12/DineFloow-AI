import { Document, model, Schema, Types } from "mongoose";

export type NotificationType =
  | "ORDER_CREATED"
  | "ORDER_CONFIRMED"
  | "ORDER_PREPARING"
  | "ORDER_READY"
  | "ORDER_SERVED"
  | "ORDER_CANCELLED"
  | "PAYMENT_SUCCESS"
  | "PAYMENT_FAILED"
  | "LOW_STOCK"
  | "NEW_TASK"
  | "TASK_COMPLETED"
  | "LOYALTY"
  | "SUBSCRIPTION"
  | "SYSTEM";

export type NotificationChannel =
  | "IN_APP"
  | "EMAIL"
  | "SMS"
  | "PUSH";

export interface INotification extends Document {
  restaurantId?: Types.ObjectId;
  branchId?: Types.ObjectId;

  recipientId: Types.ObjectId;

  type: NotificationType;
  channel: NotificationChannel;

  title: string;
  message: string;

  data?: Record<string, unknown>;

  referenceType?: string;
  referenceId?: Types.ObjectId;

  isRead: boolean;
  readAt?: Date;

  isSent: boolean;
  sentAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
    },

    branchId: {
      type: Schema.Types.ObjectId,
      ref: "Branch",
    },

    recipientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "ORDER_CREATED",
        "ORDER_CONFIRMED",
        "ORDER_PREPARING",
        "ORDER_READY",
        "ORDER_SERVED",
        "ORDER_CANCELLED",
        "PAYMENT_SUCCESS",
        "PAYMENT_FAILED",
        "LOW_STOCK",
        "NEW_TASK",
        "TASK_COMPLETED",
        "LOYALTY",
        "SUBSCRIPTION",
        "SYSTEM",
      ],
      required: true,
    },

    channel: {
      type: String,
      enum: ["IN_APP", "EMAIL", "SMS", "PUSH"],
      default: "IN_APP",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    data: {
      type: Schema.Types.Mixed,
    },

    referenceType: {
      type: String,
      trim: true,
    },

    referenceId: {
      type: Schema.Types.ObjectId,
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    readAt: {
      type: Date,
    },

    isSent: {
      type: Boolean,
      default: false,
    },

    sentAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({
  recipientId: 1,
  isRead: 1,
  createdAt: -1,
});

notificationSchema.index({
  restaurantId: 1,
  branchId: 1,
  createdAt: -1,
});

notificationSchema.index({
  referenceType: 1,
  referenceId: 1,
});

export const Notification = model<INotification>(
  "Notification",
  notificationSchema
);