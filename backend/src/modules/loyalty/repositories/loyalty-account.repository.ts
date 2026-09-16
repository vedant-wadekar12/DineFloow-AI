import { Types } from "mongoose";

import {
  LoyaltyAccount,
  ILoyaltyAccount,
} from "../models/loyalty-account.model";

class LoyaltyAccountRepository {
  async create(
    data: Partial<ILoyaltyAccount>
  ): Promise<ILoyaltyAccount> {
    return LoyaltyAccount.create(data);
  }

  async findById(
    id: string | Types.ObjectId
  ): Promise<ILoyaltyAccount | null> {
    return LoyaltyAccount.findById(id);
  }

  async findByCustomer(
    restaurantId: string | Types.ObjectId,
    customerId: string | Types.ObjectId
  ): Promise<ILoyaltyAccount | null> {
    return LoyaltyAccount.findOne({
      restaurantId,
      customerId,
      isDeleted: false,
    });
  }

  async updateById(
    id: string,
    data: Partial<ILoyaltyAccount>
  ): Promise<ILoyaltyAccount | null> {
    return LoyaltyAccount.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
        runValidators: true,
      }
    );
  }
}

export const loyaltyAccountRepository =
  new LoyaltyAccountRepository();