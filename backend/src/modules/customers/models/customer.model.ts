import {
  Document,
  Schema,
  Types,
  model,
} from "mongoose";

import {
  CustomerStatus,
} from "../constants/customer.constants";

export interface ICustomerAddress {
  label: string;
  addressLine1: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  isDefault: boolean;
}

export interface ICustomer extends Document {
  restaurantId: Types.ObjectId;

  firstName: string;
  lastName?: string;

  email?: string;
  phone: string;

  profileImage?: string;

  addresses: ICustomerAddress[];

  dateOfBirth?: Date;

  status: CustomerStatus;

  totalOrders: number;
  totalSpent: number;

  lastOrderAt?: Date;

  notes?: string;

  isActive: boolean;
  isDeleted: boolean;

  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const customerAddressSchema =
  new Schema<ICustomerAddress>(
    {
      label: {
        type: String,
        required: true,
        trim: true,
      },

      addressLine1: {
        type: String,
        required: true,
        trim: true,
      },

      addressLine2: {
        type: String,
        trim: true,
      },

      city: {
        type: String,
        trim: true,
      },

      state: {
        type: String,
        trim: true,
      },

      postalCode: {
        type: String,
        trim: true,
      },

      country: {
        type: String,
        trim: true,
        default: "India",
      },

      isDefault: {
        type: Boolean,
        default: false,
      },
    },
    {
      _id: true,
    }
  );

const customerSchema =
  new Schema<ICustomer>(
    {
      restaurantId: {
        type: Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
        index: true,
      },

      firstName: {
        type: String,
        required: true,
        trim: true,
      },

      lastName: {
        type: String,
        trim: true,
      },

      email: {
        type: String,
        lowercase: true,
        trim: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },

      profileImage: {
        type: String,
        trim: true,
      },

      addresses: {
        type: [customerAddressSchema],
        default: [],
      },

      dateOfBirth: {
        type: Date,
      },

      status: {
        type: String,
        enum: [
          "ACTIVE",
          "INACTIVE",
          "BLOCKED",
        ],
        default: "ACTIVE",
      },

      totalOrders: {
        type: Number,
        default: 0,
        min: 0,
      },

      totalSpent: {
        type: Number,
        default: 0,
        min: 0,
      },

      lastOrderAt: {
        type: Date,
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

customerSchema.index(
  {
    restaurantId: 1,
    phone: 1,
  },
  {
    unique: true,
  }
);

customerSchema.index({
  restaurantId: 1,
  email: 1,
});

customerSchema.index({
  restaurantId: 1,
  status: 1,
});

export const Customer = model<ICustomer>(
  "Customer",
  customerSchema
);