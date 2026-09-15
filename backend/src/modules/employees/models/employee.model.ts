import { Document, Schema, Types, model } from "mongoose";
import {
  EmployeeStatus,
} from "../constants/employee.constants";

export interface IEmployee extends Document {
  userId: Types.ObjectId;

  restaurantId: Types.ObjectId;
  branchId?: Types.ObjectId;

  employeeCode: string;

  designation: string;
  department?: string;

  joiningDate?: Date;
  dateOfBirth?: Date;

  emergencyContactName?: string;
  emergencyContactPhone?: string;

  salary?: number;

  status: EmployeeStatus;

  notes?: string;

  isActive: boolean;
  isDeleted: boolean;

  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const employeeSchema = new Schema<IEmployee>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

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

    employeeCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    designation: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      trim: true,
    },

    joiningDate: {
      type: Date,
    },

    dateOfBirth: {
      type: Date,
    },

    emergencyContactName: {
      type: String,
      trim: true,
    },

    emergencyContactPhone: {
      type: String,
      trim: true,
    },

    salary: {
      type: Number,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "ACTIVE",
        "INACTIVE",
        "SUSPENDED",
        "TERMINATED",
      ],
      default: "ACTIVE",
    },

    notes: {
      type: String,
      trim: true,
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

employeeSchema.index(
  {
    restaurantId: 1,
    employeeCode: 1,
  },
  {
    unique: true,
  }
);

employeeSchema.index({
  restaurantId: 1,
  branchId: 1,
  status: 1,
});

export const Employee = model<IEmployee>(
  "Employee",
  employeeSchema
);