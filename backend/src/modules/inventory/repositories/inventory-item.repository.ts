import { Types } from "mongoose";

import {
  InventoryItem,
  IInventoryItem,
} from "../models/inventory-item.model";

export class InventoryItemRepository {
  async create(
    payload: Partial<IInventoryItem>
  ): Promise<IInventoryItem> {
    return await InventoryItem.create(payload);
  }

  async findById(
    id: string | Types.ObjectId
  ): Promise<IInventoryItem | null> {
    return await InventoryItem.findOne({
      _id: id,
      isDeleted: false,
    });
  }

  async findBySku(
    restaurantId: string | Types.ObjectId,
    sku: string
  ): Promise<IInventoryItem | null> {
    return await InventoryItem.findOne({
      restaurantId,
      sku: sku.toUpperCase(),
      isDeleted: false,
    });
  }

  async findByRestaurant(
    restaurantId: string | Types.ObjectId
  ): Promise<IInventoryItem[]> {
    return await InventoryItem.find({
      restaurantId,
      isDeleted: false,
    })
      .populate("supplierId")
      .sort({
        name: 1,
      });
  }

  async findByBranch(
    branchId: string | Types.ObjectId
  ): Promise<IInventoryItem[]> {
    return await InventoryItem.find({
      branchId,
      isDeleted: false,
    })
      .populate("supplierId")
      .sort({
        name: 1,
      });
  }

  async findLowStock(
    restaurantId: string | Types.ObjectId
  ): Promise<IInventoryItem[]> {
    return await InventoryItem.find({
      restaurantId,
      isDeleted: false,
      isActive: true,
      $expr: {
        $lte: [
          "$currentStock",
          "$minimumStock",
        ],
      },
    }).sort({
      currentStock: 1,
    });
  }

  async update(
    id: string | Types.ObjectId,
    payload: Partial<IInventoryItem>
  ): Promise<IInventoryItem | null> {
    return await InventoryItem.findOneAndUpdate(
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

  async updateStock(
    id: string | Types.ObjectId,
    change: number
  ): Promise<IInventoryItem | null> {
    return await InventoryItem.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
        isActive: true,
        ...(change < 0
          ? {
              currentStock: {
                $gte: Math.abs(change),
              },
            }
          : {}),
      },
      {
        $inc: {
          currentStock: change,
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
    await InventoryItem.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        $set: {
          isDeleted: true,
          isActive: false,
        },
      }
    );
  }
}

export const inventoryItemRepository =
  new InventoryItemRepository();