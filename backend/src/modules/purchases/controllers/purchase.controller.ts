import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../../common/interfaces";

import { purchaseService } from "../services/purchase.service";

export class PurchaseController {
  async create(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const purchase =
        await purchaseService.create(
          req.body,
          req.user?.userId
        );

      res.status(201).json({
        success: true,
        data: purchase,
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
      const purchases =
        await purchaseService.getAll({
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

          supplierId:
            typeof req.query.supplierId ===
            "string"
              ? req.query.supplierId
              : undefined,

          status:
            typeof req.query.status ===
            "string"
              ? req.query.status
              : undefined,
        });

      res.json({
        success: true,
        data: purchases,
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
      const purchase =
        await purchaseService.getById(
          String(req.params.purchaseId)
        );

      res.json({
        success: true,
        data: purchase,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const purchase =
        await purchaseService.update(
          String(req.params.purchaseId),
          req.body,
          req.user?.userId
        );

      res.json({
        success: true,
        data: purchase,
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
      const purchase =
        await purchaseService.updateStatus(
          String(req.params.purchaseId),
          req.body.status,
          req.user?.userId
        );

      res.json({
        success: true,
        data: purchase,
      });
    } catch (error) {
      next(error);
    }
  }

  async receive(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const purchase =
        await purchaseService.receive(
          String(req.params.purchaseId),
          req.user?.userId
        );

      res.json({
        success: true,
        data: purchase,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const purchaseController =
  new PurchaseController();