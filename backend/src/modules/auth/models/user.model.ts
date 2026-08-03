import { Schema, model, Types, Document } from "mongoose";

export interface IUser extends Document {
  firstName: string;

  lastName: string;

  email: string;

  phone: string;

  password: string;

  profileImage?: string;

  restaurantId?: Types.ObjectId;

  branchId?: Types.ObjectId;

  roleId: Types.ObjectId;

  refreshToken?: string;

  passwordChangedAt?: Date;

  lastLogin?: Date;

  loginAttempts: number;

  lockUntil?: Date;

  isActive: boolean;

  isVerified: boolean;

  isDeleted: boolean;

  createdBy?: Types.ObjectId;

  updatedBy?: Types.ObjectId;
}

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,

      required: true,

      trim: true,
    },

    lastName: {
      type: String,

      required: true,

      trim: true,
    },

    email: {
      type: String,

      required: true,

      unique: true,

      lowercase: true,

      trim: true,
    },

    phone: {
      type: String,

      required: true,

      unique: true,

      trim: true,
    },

    password: {
      type: String,

      required: true,

      select: false,
    },

    profileImage: String,

    restaurantId: {
      type: Schema.Types.ObjectId,

      ref: "Restaurant",
    },

    branchId: {
      type: Schema.Types.ObjectId,

      ref: "Branch",
    },

    roleId: {
      type: Schema.Types.ObjectId,

      ref: "Role",

      required: true,
    },

    refreshToken: {
      type: String,

      select: false,
    },

    passwordChangedAt: Date,

    lastLogin: Date,

    loginAttempts: {
      type: Number,

      default: 0,
    },

    lockUntil: Date,

    isActive: {
      type: Boolean,

      default: true,
    },

    isVerified: {
      type: Boolean,

      default: false,
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

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

export const User = model<IUser>("User", userSchema);