import { Types } from "mongoose";

import {
  Order,
  IOrder,
} from "../models/order.model";

export class OrderRepository {
  async create(data: Partial<IOrder>) {
    return Order.create(data);
  }

  async findById(id: string) {
    return Order.findById(id)
      .populate("customerId")
      .populate("tableId")
      .populate("items.menuItemId")
      .populate("items.variantId");
  }

  async findAll(filters: {
    restaurantId?: string;
    branchId?: string;
    customerId?: string;
    tableId?: string;
    status?: string;
  }) {
    const query: Record<string, unknown> =
      {};

    if (filters.restaurantId) {
      query.restaurantId =
        new Types.ObjectId(
          filters.restaurantId
        );
    }

    if (filters.branchId) {
      query.branchId =
        new Types.ObjectId(
          filters.branchId
        );
    }

    if (filters.customerId) {
      query.customerId =
        new Types.ObjectId(
          filters.customerId
        );
    }

    if (filters.tableId) {
      query.tableId =
        new Types.ObjectId(
          filters.tableId
        );
    }

    if (filters.status) {
      query.status = filters.status;
    }

    return Order.find(query)
      .populate("customerId")
      .populate("tableId")
      .sort({
        createdAt: -1,
      });
  }

  async update(
    id: string,
    data: Partial<IOrder>
  ) {
    return Order.findByIdAndUpdate(
      id,
      {
        $set: data,
      },
      {
        new: true,
      }
    );
  }
}

export const orderRepository =
  new OrderRepository();