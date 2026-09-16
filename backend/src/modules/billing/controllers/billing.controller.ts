import { NextFunction, Request, Response } from "express";

import {
  createBillSchema,
  updateBillSchema,
} from "../validators/billing.validator";

import { billingService } from "../services/billing.service";

import { AuthenticatedRequest } from "../../../common/interfaces/authenticated-request.interface";

class BillingController {
  async create(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const input =
        createBillSchema.parse(req.body);

      const bill =
        await billingService.createBill(
          input,
          req.user!.userId
        );

      res.status(201).json({
        success: true,
        message: "Bill created successfully.",
        data: bill,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const bill =
        await billingService.getBill(
          String(req.params.billId)
        );

      res.status(200).json({
        success: true,
        data: bill,
      });
    } catch (error) {
      next(error);
    }
  }

  async getByOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const bill =
        await billingService.getBillByOrder(
          String(req.params.orderId)
        );

      res.status(200).json({
        success: true,
        data: bill,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const restaurantId =
        req.query.restaurantId
          ? String(req.query.restaurantId)
          : undefined;

      const branchId =
        req.query.branchId
          ? String(req.query.branchId)
          : undefined;

      const status =
        req.query.status
          ? String(req.query.status) as any
          : undefined;

      const bills =
        await billingService.getBills(
          restaurantId,
          branchId,
          status
        );

      res.status(200).json({
        success: true,
        data: bills,
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
      const input =
        updateBillSchema.parse(req.body);

      const bill =
        await billingService.updateBill(
          String(req.params.billId),
          input,
          req.user!.userId
        );

      res.status(200).json({
        success: true,
        message: "Bill updated successfully.",
        data: bill,
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
      const bill =
        await billingService.cancelBill(
          String(req.params.billId),
          req.user!.userId
        );

      res.status(200).json({
        success: true,
        message: "Bill cancelled successfully.",
        data: bill,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const billingController =
  new BillingController();