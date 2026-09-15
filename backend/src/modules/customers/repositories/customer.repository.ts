import { Types } from "mongoose";

import {
  Customer,
  ICustomer,
} from "../models/customer.model";

export class CustomerRepository {
  async create(
    payload: Partial<ICustomer>
  ): Promise<ICustomer> {
    return await Customer.create(payload);
  }

  async findById(
    id: string | Types.ObjectId
  ): Promise<ICustomer | null> {
    return await Customer.findOne({
      _id: id,
      isDeleted: false,
    });
  }

  async findByPhone(
    restaurantId: string | Types.ObjectId,
    phone: string
  ): Promise<ICustomer | null> {
    return await Customer.findOne({
      restaurantId,
      phone,
      isDeleted: false,
    });
  }

  async findByEmail(
    restaurantId: string | Types.ObjectId,
    email: string
  ): Promise<ICustomer | null> {
    return await Customer.findOne({
      restaurantId,
      email: email.toLowerCase(),
      isDeleted: false,
    });
  }

  async findAll(): Promise<ICustomer[]> {
    return await Customer.find({
      isDeleted: false,
    }).sort({
      createdAt: -1,
    });
  }

  async findByRestaurant(
    restaurantId: string | Types.ObjectId
  ): Promise<ICustomer[]> {
    return await Customer.find({
      restaurantId,
      isDeleted: false,
    }).sort({
      createdAt: -1,
    });
  }

  async update(
    id: string | Types.ObjectId,
    payload: Partial<ICustomer>
  ): Promise<ICustomer | null> {
    return await Customer.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        $set: payload,
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  async updateStatus(
    id: string | Types.ObjectId,
    status: string,
    isActive: boolean
  ): Promise<ICustomer | null> {
    return await Customer.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        $set: {
          status,
          isActive,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  async incrementOrderStats(
    id: string | Types.ObjectId,
    amount: number
  ): Promise<ICustomer | null> {
    return await Customer.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        $inc: {
          totalOrders: 1,
          totalSpent: amount,
        },
        $set: {
          lastOrderAt: new Date(),
        },
      },
      {
        new: true,
      }
    );
  }

  async softDelete(
    id: string | Types.ObjectId
  ): Promise<void> {
    await Customer.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        $set: {
          isDeleted: true,
          isActive: false,
          status: "INACTIVE",
        },
      }
    );
  }
}

export const customerRepository =
  new CustomerRepository();