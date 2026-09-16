import { Types } from "mongoose";

import {
  LoyaltyTransaction,
  ILoyaltyTransaction,
} from "../models/loyalty-transaction.model";

class LoyaltyTransactionRepository {
  async create(
    data: Partial<ILoyaltyTransaction>
  ): Promise<ILoyaltyTransaction> {
    return LoyaltyTransaction.create(data);
  }

  async findByCustomer(
    customerId: string | Types.ObjectId
  ): Promise<ILoyaltyTransaction[]> {
    return LoyaltyTransaction.find({
      customerId,
    }).sort({
      createdAt: -1,
    });
  }

  async findByAccount(
    loyaltyAccountId: string | Types.ObjectId
  ): Promise<ILoyaltyTransaction[]> {
    return LoyaltyTransaction.find({
      loyaltyAccountId,
    }).sort({
      createdAt: -1,
    });
  }
}

export const loyaltyTransactionRepository =
  new LoyaltyTransactionRepository();