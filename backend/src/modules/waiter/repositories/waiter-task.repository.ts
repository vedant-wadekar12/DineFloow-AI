import { Types } from "mongoose";

import {
  WaiterTask,
  IWaiterTask,
} from "../models/waiter-task.model";

export class WaiterTaskRepository {
  async create(
    data: Partial<IWaiterTask>
  ) {
    return WaiterTask.create(data);
  }

  async findById(id: string) {
    return WaiterTask.findById(id)
      .populate("orderId")
      .populate("tableId")
      .populate("waiterId");
  }

  async findByOrderId(
    orderId: string
  ) {
    return WaiterTask.findOne({
      orderId: new Types.ObjectId(
        orderId
      ),
    })
      .populate("orderId")
      .populate("tableId")
      .populate("waiterId");
  }

  async findAll(filters: {
    restaurantId?: string;
    branchId?: string;
    waiterId?: string;
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

    if (filters.waiterId) {
      query.waiterId =
        new Types.ObjectId(
          filters.waiterId
        );
    }

    if (filters.status) {
      query.status =
        filters.status;
    }

    return WaiterTask.find(query)
      .populate("orderId")
      .populate("tableId")
      .populate("waiterId")
      .sort({
        priority: -1,
        createdAt: 1,
      });
  }

  async update(
    id: string,
    data: Partial<IWaiterTask>
  ) {
    return WaiterTask.findByIdAndUpdate(
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

export const waiterTaskRepository =
  new WaiterTaskRepository();