import {
  NextFunction,
  Request,
  Response,
} from "express";

import { AuthenticatedRequest } from "../../../common/interfaces";

import {
  stockAdjustmentSchema,
} from "../validators/stock.validator";

import {
  stockService,
} from "../services/stock.service";

export class StockController {
  async adjust(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data =
        stockAdjustmentSchema.parse(
          req.body
        );

      const result =
        await stockService.adjustStock(
          data,
          req.user?.userId
        );

      res.status(200).json({
        success: true,
        message:
          "Stock updated successfully.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTransactions(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result =
        await stockService.getTransactions(
          String(
            req.params.inventoryItemId
          )
        );

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getRestaurantTransactions(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result =
        await stockService.getRestaurantTransactions(
          String(req.params.restaurantId)
        );

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const stockController =
  new StockController();