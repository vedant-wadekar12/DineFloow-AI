import { Types } from "mongoose";
import {
  Purchase,
  IPurchase,
} from "../models/purchase.model";

export class PurchaseRepository {
  async create(data: Partial<IPurchase>) {
    return Purchase.create(data);
  }

  async findById(id: string) {
    return Purchase.findById(id)
      .populate("supplierId")
      .populate("items.inventoryItemId");
  }

  async findAll(filters: {
    restaurantId?: string;
    branchId?: string;
    supplierId?: string;
    status?: string;
  }) {
    const query: Record<string, unknown> = {};

    if (filters.restaurantId) {
      query.restaurantId =
        new Types.ObjectId(filters.restaurantId);
    }

    if (filters.branchId) {
      query.branchId =
        new Types.ObjectId(filters.branchId);
    }

    if (filters.supplierId) {
      query.supplierId =
        new Types.ObjectId(filters.supplierId);
    }

    if (filters.status) {
      query.status = filters.status;
    }

    return Purchase.find(query)
      .populate("supplierId")
      .sort({
        purchaseDate: -1,
      });
  }

  async update(
    id: string,
    data: Partial<IPurchase>
  ) {
    return Purchase.findByIdAndUpdate(
      id,
      {
        $set: data,
      },
      {
        new: true,
      }
    );
  }

  async updateStatus(
    id: string,
    status: IPurchase["status"],
    userId?: string
  ) {
    return Purchase.findByIdAndUpdate(
      id,
      {
        $set: {
          status,
          updatedBy: userId,
        },
      },
      {
        new: true,
      }
    );
  }

  async receive(
    id: string,
    items: IPurchase["items"],
    userId?: string
  ) {
    return Purchase.findByIdAndUpdate(
      id,
      {
        $set: {
          items,
          status: "RECEIVED",
          receivedBy: userId,
          receivedAt: new Date(),
          updatedBy: userId,
        },
      },
      {
        new: true,
      }
    );
  }
}

export const purchaseRepository =
  new PurchaseRepository();