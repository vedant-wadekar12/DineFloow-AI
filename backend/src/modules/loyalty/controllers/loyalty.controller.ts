import {
  NextFunction,
  Request,
  Response,
} from "express";

import { AuthenticatedRequest } from "../../../common/interfaces/authenticated-request.interface";

import {
  createLoyaltyAccountSchema,
  earnPointsSchema,
  redeemPointsSchema,
  adjustPointsSchema,
} from "../validators/loyalty.validator";

import {
  loyaltyService,
} from "../services/loyalty.service";

class LoyaltyController {
  async getAccount(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const account =
        await loyaltyService.getAccount(
          String(req.query.restaurantId),
          String(req.params.customerId)
        );

      res.status(200).json({
        success: true,
        data: account,
      });
    } catch (error) {
      next(error);
    }
  }

  async createAccount(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const input =
        createLoyaltyAccountSchema.parse(
          req.body
        );

      const account =
        await loyaltyService.getOrCreateAccount(
          input.restaurantId,
          input.customerId
        );

      res.status(201).json({
        success: true,
        message:
          "Loyalty account created successfully.",
        data: account,
      });
    } catch (error) {
      next(error);
    }
  }

  async earn(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const input =
        earnPointsSchema.parse(
          req.body
        );

      const account =
        await loyaltyService.earnPoints(
          input,
          req.user!.userId
        );

      res.status(200).json({
        success: true,
        message:
          "Loyalty points earned successfully.",
        data: account,
      });
    } catch (error) {
      next(error);
    }
  }

  async redeem(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const input =
        redeemPointsSchema.parse(
          req.body
        );

      const account =
        await loyaltyService.redeemPoints(
          input,
          req.user!.userId
        );

      res.status(200).json({
        success: true,
        message:
          "Loyalty points redeemed successfully.",
        data: account,
      });
    } catch (error) {
      next(error);
    }
  }

  async adjust(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const input =
        adjustPointsSchema.parse(
          req.body
        );

      const account =
        await loyaltyService.adjustPoints(
          input,
          req.user!.userId
        );

      res.status(200).json({
        success: true,
        message:
          "Loyalty points adjusted successfully.",
        data: account,
      });
    } catch (error) {
      next(error);
    }
  }

  async transactions(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const transactions =
        await loyaltyService.getTransactions(
          String(req.params.customerId)
        );

      res.status(200).json({
        success: true,
        data: transactions,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const loyaltyController =
  new LoyaltyController();