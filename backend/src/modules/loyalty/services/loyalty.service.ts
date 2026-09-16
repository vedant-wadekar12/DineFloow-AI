import { Types } from "mongoose";

import {
  BadRequestError,
  NotFoundError,
} from "../../../common/errors";

import {
  loyaltyAccountRepository,
} from "../repositories/loyalty-account.repository";

import {
  loyaltyTransactionRepository,
} from "../repositories/loyalty-transaction.repository";

import {
  EarnPointsInput,
  RedeemPointsInput,
  AdjustPointsInput,
} from "../validators/loyalty.validator";

import {
  ILoyaltyAccount,
} from "../models/loyalty-account.model";

class LoyaltyService {
  async getOrCreateAccount(
    restaurantId: string,
    customerId: string
  ): Promise<ILoyaltyAccount> {
    const existing =
      await loyaltyAccountRepository.findByCustomer(
        restaurantId,
        customerId
      );

    if (existing) {
      return existing;
    }

    return loyaltyAccountRepository.create({
      restaurantId:
        new Types.ObjectId(restaurantId),

      customerId:
        new Types.ObjectId(customerId),

      pointsBalance: 0,
      lifetimeEarned: 0,
      lifetimeRedeemed: 0,

      isActive: true,
      isDeleted: false,
    });
  }

  async getAccount(
    restaurantId: string,
    customerId: string
  ) {
    const account =
      await loyaltyAccountRepository.findByCustomer(
        restaurantId,
        customerId
      );

    if (!account) {
      throw new NotFoundError(
        "Loyalty account not found."
      );
    }

    return account;
  }

  async earnPoints(
    input: EarnPointsInput,
    userId: string
  ) {
    const account =
      await this.getOrCreateAccount(
        input.restaurantId,
        input.customerId
      );

    const balanceBefore =
      account.pointsBalance;

    const balanceAfter =
      balanceBefore + input.points;

    account.pointsBalance =
      balanceAfter;

    account.lifetimeEarned +=
      input.points;

    await account.save();

    await loyaltyTransactionRepository.create({
      restaurantId:
        new Types.ObjectId(
          input.restaurantId
        ),

      customerId:
        new Types.ObjectId(
          input.customerId
        ),

      loyaltyAccountId:
        account._id,

      type: "EARN",

      points: input.points,

      balanceBefore,

      balanceAfter,

      orderId:
        input.orderId
          ? new Types.ObjectId(
              input.orderId
            )
          : undefined,

      reason:
        input.reason,

      expiresAt:
        input.expiresAt,

      createdBy:
        new Types.ObjectId(userId),
    });

    return account;
  }

  async redeemPoints(
    input: RedeemPointsInput,
    userId: string
  ) {
    const account =
      await this.getAccount(
        input.restaurantId,
        input.customerId
      );

    if (!account.isActive) {
      throw new BadRequestError(
        "Loyalty account is inactive."
      );
    }

    if (
      account.pointsBalance <
      input.points
    ) {
      throw new BadRequestError(
        "Insufficient loyalty points."
      );
    }

    const balanceBefore =
      account.pointsBalance;

    const balanceAfter =
      balanceBefore - input.points;

    account.pointsBalance =
      balanceAfter;

    account.lifetimeRedeemed +=
      input.points;

    await account.save();

    await loyaltyTransactionRepository.create({
      restaurantId:
        new Types.ObjectId(
          input.restaurantId
        ),

      customerId:
        new Types.ObjectId(
          input.customerId
        ),

      loyaltyAccountId:
        account._id,

      type: "REDEEM",

      points: input.points,

      balanceBefore,

      balanceAfter,

      orderId:
        input.orderId
          ? new Types.ObjectId(
              input.orderId
            )
          : undefined,

      reason:
        input.reason,

      createdBy:
        new Types.ObjectId(userId),
    });

    return account;
  }

  async adjustPoints(
    input: AdjustPointsInput,
    userId: string
  ) {
    const account =
      await this.getAccount(
        input.restaurantId,
        input.customerId
      );

    const balanceBefore =
      account.pointsBalance;

    const balanceAfter =
      balanceBefore + input.points;

    if (balanceAfter < 0) {
      throw new BadRequestError(
        "Point adjustment cannot make balance negative."
      );
    }

    account.pointsBalance =
      balanceAfter;

    if (input.points > 0) {
      account.lifetimeEarned +=
        input.points;
    }

    if (input.points < 0) {
      account.lifetimeRedeemed +=
        Math.abs(input.points);
    }

    await account.save();

    await loyaltyTransactionRepository.create({
      restaurantId:
        new Types.ObjectId(
          input.restaurantId
        ),

      customerId:
        new Types.ObjectId(
          input.customerId
        ),

      loyaltyAccountId:
        account._id,

      type: "ADJUSTMENT",

      points: Math.abs(input.points),

      balanceBefore,

      balanceAfter,

      reason:
        input.reason,

      createdBy:
        new Types.ObjectId(userId),
    });

    return account;
  }

  async getTransactions(
    customerId: string
  ) {
    return loyaltyTransactionRepository.findByCustomer(
      customerId
    );
  }
}

export const loyaltyService =
  new LoyaltyService();