import {
  Schema,
  model,
  Document,
  Types,
} from "mongoose";

export type WaiterTaskStatus =
  | "PENDING"
  | "ACCEPTED"
  | "SERVING"
  | "SERVED"
  | "CANCELLED";

export interface IWaiterTask extends Document {
  restaurantId: Types.ObjectId;

  branchId?: Types.ObjectId;

  orderId: Types.ObjectId;

  tableId?: Types.ObjectId;

  waiterId?: Types.ObjectId;

  taskNumber: string;

  status: WaiterTaskStatus;

  priority: number;

  acceptedAt?: Date;

  servingAt?: Date;

  servedAt?: Date;

  cancelledAt?: Date;

  cancellationReason?: string;

  notes?: string;

  createdAt: Date;

  updatedAt: Date;
}

const waiterTaskSchema =
  new Schema<IWaiterTask>(
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
        index: true,
      },

      orderId: {
        type: Schema.Types.ObjectId,
        ref: "Order",
        required: true,
        unique: true,
        index: true,
      },

      tableId: {
        type: Schema.Types.ObjectId,
        ref: "Table",
        index: true,
      },

      waiterId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true,
      },

      taskNumber: {
        type: String,
        required: true,
        unique: true,
        index: true,
      },

      status: {
        type: String,
        enum: [
          "PENDING",
          "ACCEPTED",
          "SERVING",
          "SERVED",
          "CANCELLED",
        ],
        default: "PENDING",
        index: true,
      },

      priority: {
        type: Number,
        default: 0,
        min: 0,
      },

      acceptedAt: Date,

      servingAt: Date,

      servedAt: Date,

      cancelledAt: Date,

      cancellationReason: {
        type: String,
        maxlength: 500,
      },

      notes: {
        type: String,
        maxlength: 1000,
      },
    },
    {
      timestamps: true,
    }
  );

waiterTaskSchema.index({
  restaurantId: 1,
  branchId: 1,
  status: 1,
  priority: -1,
  createdAt: 1,
});

export const WaiterTask =
  model<IWaiterTask>(
    "WaiterTask",
    waiterTaskSchema
  );