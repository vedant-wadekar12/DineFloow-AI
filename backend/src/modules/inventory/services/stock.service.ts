import { Types } from "mongoose";

import {
  BadRequestError,
  NotFoundError,
} from "../../../common/errors";

import {
  inventoryItemRepository,
} from "../repositories/inventory-item.repository";

import {
  stockTransactionRepository,
} from "../repositories/stock-transaction.repository";

import {
  StockAdjustmentDto,
} from "../dto/stock.dto";

export class StockService {
  async adjustStock(
    data: StockAdjustmentDto,
    userId?: string
  ) {
    if (
      !Types.ObjectId.isValid(
        data.inventoryItemId
      )
    ) {
      throw new BadRequestError(
        "Invalid inventory item ID."
      );
    }

    const item =
      await inventoryItemRepository.findById(
        data.inventoryItemId
      );

    if (!item) {
      throw new NotFoundError(
        "Inventory item not found."
      );
    }

    let change = 0;

    switch (data.type) {
      case "PURCHASE":
      case "RETURN":
        change = data.quantity;
        break;

      case "CONSUMPTION":
      case "WASTE":
        change = -data.quantity;
        break;

      case "ADJUSTMENT":
        change = data.quantity;
        break;

      default:
        throw new BadRequestError(
          "Invalid stock transaction type."
        );
    }

    const previousStock =
      item.currentStock;

    const updated =
      await inventoryItemRepository.updateStock(
        item._id,
        change
      );

    if (!updated) {
      throw new BadRequestError(
        "Insufficient stock or inventory item is inactive."
      );
    }

    const transaction =
      await stockTransactionRepository.create({
        inventoryItemId: item._id,

        restaurantId:
          item.restaurantId,

        branchId:
          item.branchId,

        type: data.type,

        quantity: data.quantity,

        previousStock,

        newStock:
          updated.currentStock,

        reason: data.reason,

        referenceType:
          data.referenceType,

        referenceId:
          data.referenceId &&
          Types.ObjectId.isValid(
            data.referenceId
          )
            ? new Types.ObjectId(
                data.referenceId
              )
            : undefined,

        createdBy: userId
          ? new Types.ObjectId(userId)
          : undefined,
      });

    return {
      inventoryItem: updated,
      transaction,
    };
  }

  async consumeStock(
    inventoryItemId: string,
    quantity: number,
    reason?: string,
    referenceType?: string,
    referenceId?: string,
    userId?: string
  ) {
    return await this.adjustStock(
      {
        inventoryItemId,
        quantity,
        type: "CONSUMPTION",
        reason,
        referenceType,
        referenceId,
      },
      userId
    );
  }

  async getTransactions(
    inventoryItemId: string
  ) {
    return await stockTransactionRepository.findByInventoryItem(
      inventoryItemId
    );
  }

  async getRestaurantTransactions(
    restaurantId: string
  ) {
    return await stockTransactionRepository.findByRestaurant(
      restaurantId
    );
  }
}

export const stockService =
  new StockService();