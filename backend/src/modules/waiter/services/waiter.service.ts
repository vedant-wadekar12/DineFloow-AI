import { randomUUID } from "crypto";
import { Types } from "mongoose";

import { NotFoundError } from "../../../common/errors";

import { Order } from "../../orders/models/order.model";
import { User } from "../../auth/models/user.model";

import {
  waiterTaskRepository,
} from "../repositories/waiter-task.repository";

import {
  createWaiterTaskSchema,
  assignWaiterSchema,
  updateWaiterPrioritySchema,
  waiterCancelSchema,
} from "../validators/waiter.validator";

export class WaiterService {
  async createFromOrder(
    input: unknown
  ) {
    const data =
      createWaiterTaskSchema.parse(
        input
      );

    const existing =
      await waiterTaskRepository.findByOrderId(
        data.orderId
      );

    if (existing) {
      return existing;
    }

    const order =
      await Order.findById(
        data.orderId
      );

    if (!order) {
      throw new NotFoundError(
        "Order not found"
      );
    }

    if (
      order.status !== "READY"
    ) {
      throw new Error(
        "Only ready orders can be assigned to waiter"
      );
    }

    const taskNumber =
      `WT-${Date.now()}-${randomUUID()
        .slice(0, 6)
        .toUpperCase()}`;

    return waiterTaskRepository.create({
      restaurantId:
        order.restaurantId,

      branchId:
        order.branchId,

      orderId:
        order._id,

      tableId:
        order.tableId,

      taskNumber,

      status: "PENDING",

      priority: 0,
    });
  }

  async getById(id: string) {
    const task =
      await waiterTaskRepository.findById(
        id
      );

    if (!task) {
      throw new NotFoundError(
        "Waiter task not found"
      );
    }

    return task;
  }

  async getAll(filters: {
    restaurantId?: string;
    branchId?: string;
    waiterId?: string;
    status?: string;
  }) {
    return waiterTaskRepository.findAll(
      filters
    );
  }

  async assignWaiter(
    id: string,
    input: unknown
  ) {
    const data =
      assignWaiterSchema.parse(
        input
      );

    const task =
      await this.getById(id);

    if (
      task.status === "SERVED" ||
      task.status === "CANCELLED"
    ) {
      throw new Error(
        "Waiter cannot be assigned to completed task"
      );
    }

    const waiter =
      await User.findOne({
        _id: data.waiterId,
        isActive: true,
        isDeleted: false,
      });

    if (!waiter) {
      throw new NotFoundError(
        "Waiter not found"
      );
    }

    return waiterTaskRepository.update(
      id,
      {
        waiterId:
          new Types.ObjectId(
            data.waiterId
          ),
      }
    );
  }

  async accept(
    id: string,
    waiterId: string
  ) {
    const task =
      await this.getById(id);

    if (
      task.status !== "PENDING"
    ) {
      throw new Error(
        "Only pending waiter tasks can be accepted"
      );
    }

    return waiterTaskRepository.update(
      id,
      {
        status: "ACCEPTED",

        waiterId:
          new Types.ObjectId(
            waiterId
          ),

        acceptedAt:
          new Date(),
      }
    );
  }

  async startServing(
    id: string,
    waiterId: string
  ) {
    const task =
      await this.getById(id);

    if (
      task.status !== "ACCEPTED"
    ) {
      throw new Error(
        "Only accepted waiter tasks can start serving"
      );
    }

    return waiterTaskRepository.update(
      id,
      {
        status: "SERVING",

        waiterId:
          new Types.ObjectId(
            waiterId
          ),

        servingAt:
          new Date(),
      }
    );
  }

  async markServed(id: string) {
    const task =
      await this.getById(id);

    if (
      task.status !== "SERVING" &&
      task.status !== "ACCEPTED"
    ) {
      throw new Error(
        "Only active serving tasks can be marked served"
      );
    }

    const updated =
      await waiterTaskRepository.update(
        id,
        {
          status: "SERVED",
          servedAt: new Date(),
        }
      );

    await Order.findByIdAndUpdate(
      task.orderId,
      {
        $set: {
          status: "SERVED",
          servedAt: new Date(),
        },
      }
    );

    return updated;
  }

  async completeOrder(id: string) {
    const task =
      await this.getById(id);

    if (
      task.status !== "SERVED"
    ) {
      throw new Error(
        "Only served tasks can complete the order"
      );
    }

    await Order.findByIdAndUpdate(
      task.orderId,
      {
        $set: {
          status: "COMPLETED",
          completedAt: new Date(),
        },
      }
    );

    return task;
  }

  async cancel(
    id: string,
    input: unknown
  ) {
    const data =
      waiterCancelSchema.parse(
        input
      );

    const task =
      await this.getById(id);

    if (
      task.status === "SERVED" ||
      task.status === "CANCELLED"
    ) {
      throw new Error(
        "Task cannot be cancelled"
      );
    }

    return waiterTaskRepository.update(
      id,
      {
        status: "CANCELLED",

        cancellationReason:
          data.reason,

        cancelledAt:
          new Date(),
      }
    );
  }

  async updatePriority(
    id: string,
    input: unknown
  ) {
    const data =
      updateWaiterPrioritySchema.parse(
        input
      );

    const task =
      await this.getById(id);

    if (
      task.status === "SERVED" ||
      task.status === "CANCELLED"
    ) {
      throw new Error(
        "Completed task priority cannot be changed"
      );
    }

    return waiterTaskRepository.update(
      id,
      {
        priority:
          data.priority,
      }
    );
  }
}

export const waiterService =
  new WaiterService();