import { Types } from "mongoose";

import {
  IStockTransaction,
  StockTransaction,
} from "../models/stock-transaction.model";

export class StockTransactionRepository {
  async create(
    payload: Partial<IStockTransaction>
  ): Promise<IStockTransaction> {
    return await StockTransaction.create(
      payload
    );
  }

  async findByInventoryItem(
    inventoryItemId: string | Types.ObjectId
  ): Promise<IStockTransaction[]> {
    return await StockTransaction.find({
      inventoryItemId,
    })
      .populate("createdBy")
      .sort({
        createdAt: -1,
      });
  }

  async findByRestaurant(
    restaurantId: string | Types.ObjectId
  ): Promise<IStockTransaction[]> {
    return await StockTransaction.find({
      restaurantId,
    })
      .sort({
        createdAt: -1,
      })
      .limit(500);
  }
}

export const stockTransactionRepository =
  new StockTransactionRepository();