import {
  Document,
  Model,
  Schema,
  Types,
  model,
} from "mongoose";

export type PaymentMethod =
  | "CASH"
  | "UPI"
  | "CARD"
  | "NET_BANKING"
  | "WALLET"
  | "OTHER";

export type PaymentStatus =
  | "PENDING"
  | "PROCESSING"
  | "SUCCESS"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";

export interface IPayment extends Document {
  paymentNumber: string;

  restaurantId: Types.ObjectId;
  branchId?: Types.ObjectId;

  orderId: Types.ObjectId;
  billId: Types.ObjectId;

  customerId?: Types.ObjectId;

  amount: number;

  method: PaymentMethod;
  status: PaymentStatus;

  transactionId?: string;
  gateway?: string;

  currency: string;

  gatewayResponse?: Record<string, unknown>;

  refundAmount: number;
  refundedAt?: Date;

  failureReason?: string;

  paidAt?: Date;

  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    paymentNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    restaurantId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    branchId: {
      type: Schema.Types.ObjectId,
      index: true,
    },

    orderId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    billId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    customerId: {
      type: Schema.Types.ObjectId,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    method: {
      type: String,
      enum: [
        "CASH",
        "UPI",
        "CARD",
        "NET_BANKING",
        "WALLET",
        "OTHER",
      ],
      required: true,
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "PROCESSING",
        "SUCCESS",
        "FAILED",
        "CANCELLED",
        "REFUNDED",
        "PARTIALLY_REFUNDED",
      ],
      default: "PENDING",
      index: true,
    },

    transactionId: {
      type: String,
      trim: true,
      index: true,
    },

    gateway: {
      type: String,
      trim: true,
    },

    currency: {
      type: String,
      default: "INR",
      uppercase: true,
      trim: true,
    },

    gatewayResponse: {
      type: Schema.Types.Mixed,
    },

    refundAmount: {
      type: Number,
      min: 0,
      default: 0,
    },

    refundedAt: Date,

    failureReason: {
      type: String,
      trim: true,
    },

    paidAt: Date,

    createdBy: {
      type: Schema.Types.ObjectId,
    },

    updatedBy: {
      type: Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);

paymentSchema.index({
  restaurantId: 1,
  branchId: 1,
  createdAt: -1,
});

paymentSchema.index({
  billId: 1,
  status: 1,
});

export const Payment: Model<IPayment> =
  model<IPayment>(
    "Payment",
    paymentSchema
  );