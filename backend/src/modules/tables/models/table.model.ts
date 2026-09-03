import {
  Document,
  Schema,
  Types,
  model,
} from "mongoose";

export type TableStatus =
  | "AVAILABLE"
  | "OCCUPIED"
  | "RESERVED"
  | "CLEANING"
  | "OUT_OF_SERVICE";

export interface ITable extends Document {
  branchId: Types.ObjectId;
  floorId: Types.ObjectId;
  name: string;
  tableNumber: number;
  capacity: number;
  status: TableStatus;
  qrCode?: string;
  position?: {
    x: number;
    y: number;
  };
  isActive: boolean;
  isDeleted: boolean;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
}

const tableSchema = new Schema<ITable>(
  {
    branchId: {
      type: Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
      index: true,
    },

    floorId: {
      type: Schema.Types.ObjectId,
      ref: "Floor",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    tableNumber: {
      type: Number,
      required: true,
      min: 1,
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: [
        "AVAILABLE",
        "OCCUPIED",
        "RESERVED",
        "CLEANING",
        "OUT_OF_SERVICE",
      ],
      default: "AVAILABLE",
    },

    qrCode: {
      type: String,
      trim: true,
    },

    position: {
      x: {
        type: Number,
      },
      y: {
        type: Number,
      },
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

tableSchema.index(
  { floorId: 1, tableNumber: 1 },
  { unique: true }
);

export const Table = model<ITable>(
  "Table",
  tableSchema
);