import { randomUUID } from "crypto";
import { Types } from "mongoose";

import { NotFoundError } from "../../../common/errors";

import { Order } from "../../orders/models/order.model";
import { User } from "../../auth/models/user.model";

import {
  KitchenTicketStatus,
  IKitchenTicket,
} from "../models/kitchen-ticket.model";

import {
  kitchenTicketRepository,
} from "../repositories/kitchen-ticket.repository";

import {
  createKitchenTicketSchema,
  assignChefSchema,
  cancelKitchenTicketSchema,
  updatePrioritySchema,
} from "../validators/kitchen.validator";

export class KitchenService {
  async createFromOrder(
    input: unknown
  ) {
    const data =
      createKitchenTicketSchema.parse(
        input
      );

    const existing =
      await kitchenTicketRepository.findByOrderId(
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
      order.status === "CANCELLED" ||
      order.status === "COMPLETED"
    ) {
      throw new Error(
        "Cancelled or completed order cannot enter kitchen"
      );
    }

    const items =
      order.items.map((item) => ({
        orderItemId:
          item.menuItemId  as Types.ObjectId,

        menuItemId:
          item.menuItemId,

        name:
          item.name,

        variantName:
          item.variantName,

        quantity:
          item.quantity,

        specialInstructions:
          item.specialInstructions,

        addons:
          item.addons.map(
            (addon) => ({
              name: addon.name,
              quantity:
                addon.quantity,
            })
          ),
      }));

    const ticketNumber =
      `KT-${Date.now()}-${randomUUID()
        .slice(0, 6)
        .toUpperCase()}`;

    return kitchenTicketRepository.create({
      restaurantId:
        order.restaurantId,

      branchId:
        order.branchId,

      orderId:
        order._id,

      tableId:
        order.tableId,

      ticketNumber,

      items,

      status: "QUEUED",

      priority: 0,
    });
  }

  async getById(id: string) {
    const ticket =
      await kitchenTicketRepository.findById(
        id
      );

    if (!ticket) {
      throw new NotFoundError(
        "Kitchen ticket not found"
      );
    }

    return ticket;
  }

  async getAll(filters: {
    restaurantId?: string;
    branchId?: string;
    status?: string;
  }) {
    return kitchenTicketRepository.findAll(
      filters
    );
  }

  async assignChef(
    id: string,
    input: unknown
  ) {
    const data =
      assignChefSchema.parse(input);

    const ticket =
      await this.getById(id);

    if (
      ticket.status === "READY" ||
      ticket.status === "CANCELLED"
    ) {
      throw new Error(
        "Chef cannot be assigned to this ticket"
      );
    }

    const chef =
      await User.findOne({
        _id: data.chefId,
        isActive: true,
        isDeleted: false,
      });

    if (!chef) {
      throw new NotFoundError(
        "Chef not found"
      );
    }

    return kitchenTicketRepository.update(
      id,
      {
        assignedChefId:
          new Types.ObjectId(
            data.chefId
          ),
      }
    );
  }

  async accept(
    id: string,
    chefId: string
  ) {
    const ticket =
      await this.getById(id);

    if (
      ticket.status !== "QUEUED"
    ) {
      throw new Error(
        "Only queued tickets can be accepted"
      );
    }

    const updated =
      await kitchenTicketRepository.update(
        id,
        {
          status: "ACCEPTED",

          assignedChefId:
            new Types.ObjectId(
              chefId
            ),

          acceptedAt:
            new Date(),
        }
      );

    await Order.findByIdAndUpdate(
      ticket.orderId,
      {
        $set: {
          status: "CONFIRMED",
          confirmedAt:
            new Date(),
        },
      }
    );

    return updated;
  }

  async startPreparing(
    id: string,
    chefId: string
  ) {
    const ticket =
      await this.getById(id);

    if (
      ticket.status !== "ACCEPTED"
    ) {
      throw new Error(
        "Only accepted tickets can start preparation"
      );
    }

    const updated =
      await kitchenTicketRepository.update(
        id,
        {
          status: "PREPARING",

          assignedChefId:
            new Types.ObjectId(
              chefId
            ),

          startedAt:
            new Date(),
        }
      );

    await Order.findByIdAndUpdate(
      ticket.orderId,
      {
        $set: {
          status: "PREPARING",
          preparingAt:
            new Date(),
        },
      }
    );

    return updated;
  }

  async markReady(id: string) {
    const ticket =
      await this.getById(id);

    if (
      ticket.status !== "PREPARING"
    ) {
      throw new Error(
        "Only preparing tickets can be marked ready"
      );
    }

    const updated =
      await kitchenTicketRepository.update(
        id,
        {
          status: "READY",
          readyAt: new Date(),
        }
      );

    await Order.findByIdAndUpdate(
      ticket.orderId,
      {
        $set: {
          status: "READY",
          readyAt: new Date(),
        },
      }
    );

    return updated;
  }

  async cancel(
    id: string,
    input: unknown
  ) {
    const data =
      cancelKitchenTicketSchema.parse(
        input
      );

    const ticket =
      await this.getById(id);

    if (
      ticket.status === "READY" ||
      ticket.status === "CANCELLED"
    ) {
      throw new Error(
        "Ticket cannot be cancelled now"
      );
    }

    const updated =
      await kitchenTicketRepository.update(
        id,
        {
          status: "CANCELLED",

          cancellationReason:
            data.reason,

          cancelledAt:
            new Date(),
        },
      );

    await Order.findByIdAndUpdate(
      ticket.orderId,
      {
        $set: {
          status: "CANCELLED",
          cancellationReason:
            data.reason,
          cancelledAt:
            new Date(),
        },
      }
    );

    return updated;
  }

  async updatePriority(
    id: string,
    input: unknown
  ) {
    const data =
      updatePrioritySchema.parse(
        input
      );

    const ticket =
      await this.getById(id);

    if (
      ticket.status === "READY" ||
      ticket.status === "CANCELLED"
    ) {
      throw new Error(
        "Completed kitchen tickets cannot change priority"
      );
    }

    return kitchenTicketRepository.update(
      id,
      {
        priority:
          data.priority,
      }
    );
  }
}

export const kitchenService =
  new KitchenService();