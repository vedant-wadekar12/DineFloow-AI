import {
  Response,
  NextFunction,
} from "express";

import { AuthenticatedRequest } from "../../../common/interfaces";

import { orderService } from "../services/order.service";

export class OrderController {
  async create(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const order =
        await orderService.create(
          req.body,
          req.user?.userId
        );

      res.status(201).json({
        success: true,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const orders =
        await orderService.getAll({
          restaurantId:
            typeof req.query.restaurantId ===
            "string"
              ? req.query.restaurantId
              : undefined,

          branchId:
            typeof req.query.branchId ===
            "string"
              ? req.query.branchId
              : undefined,

          customerId:
            typeof req.query.customerId ===
            "string"
              ? req.query.customerId
              : undefined,

          tableId:
            typeof req.query.tableId ===
            "string"
              ? req.query.tableId
              : undefined,

          status:
            typeof req.query.status ===
            "string"
              ? req.query.status
              : undefined,
        });

      res.json({
        success: true,
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const order =
        await orderService.getById(
          String(req.params.orderId)
        );

      res.json({
        success: true,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const order =
        await orderService.updateStatus(
          String(req.params.orderId),
          req.body,
          req.user?.userId
        );

      res.json({
        success: true,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  async cancel(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const order =
        await orderService.cancel(
          String(req.params.orderId),
          req.body,
          req.user?.userId
        );

      res.json({
        success: true,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const orderController =
  new OrderController();