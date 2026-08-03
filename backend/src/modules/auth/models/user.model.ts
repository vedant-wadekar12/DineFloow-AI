import { Schema, model, Types, Document } from "mongoose";
import bcrypt from "bcrypt";
import { env } from "../../../config";

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

  comparePassword(candidatePassword: string): Promise<boolean>;

  changedPasswordAfter(JWTTimestamp: number): boolean;
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

/* ===========================
   Password Hashing
=========================== */

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(
    this.password,
    env.BCRYPT_SALT_ROUNDS
  );

  next();
});

/* ===========================
   Compare Password
=========================== */

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

/* ===========================
   Password Changed Check
=========================== */

userSchema.methods.changedPasswordAfter = function (
  JWTTimestamp: number
): boolean {
  if (!this.passwordChangedAt) {
    return false;
  }

  const changedTimestamp = Math.floor(
    this.passwordChangedAt.getTime() / 1000
  );

  return JWTTimestamp < changedTimestamp;
};

/* ===========================
   Hide Sensitive Fields
=========================== */

userSchema.set("toJSON", {
  transform(_doc, ret) {
    delete ret.password;
    delete ret.refreshToken;

    return ret;
  },
});

/* ===========================
   Virtual Fields
=========================== */

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

export const User = model<IUser>("User", userSchema);