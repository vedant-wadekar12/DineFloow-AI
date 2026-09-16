import { Types } from "mongoose";

import {
  KitchenTicket,
  IKitchenTicket,
} from "../models/kitchen-ticket.model";

export class KitchenTicketRepository {
  async create(
    data: Partial<IKitchenTicket>
  ) {
    return KitchenTicket.create(data);
  }

  async findById(id: string) {
    return KitchenTicket.findById(id)
      .populate("orderId")
      .populate("tableId")
      .populate("assignedChefId");
  }

  async findByOrderId(orderId: string) {
    return KitchenTicket.findOne({
      orderId: new Types.ObjectId(orderId),
    })
      .populate("orderId")
      .populate("tableId")
      .populate("assignedChefId");
  }

  async findAll(filters: {
    restaurantId?: string;
    branchId?: string;
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

    if (filters.status) {
      query.status = filters.status;
    }

    return KitchenTicket.find(query)
      .populate("orderId")
      .populate("tableId")
      .populate("assignedChefId")
      .sort({
        priority: -1,
        createdAt: 1,
      });
  }

  async update(
    id: string,
    data: Partial<IKitchenTicket>
  ) {
    return KitchenTicket.findByIdAndUpdate(
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

export const kitchenTicketRepository =
  new KitchenTicketRepository();