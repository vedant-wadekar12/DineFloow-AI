import {
  NextFunction,
  Request,
  Response,
} from "express";

import { AuthenticatedRequest } from "../../../common/interfaces/authenticated-request.interface";

import {
  createPaymentSchema,
  processPaymentSchema,
  failPaymentSchema,
  refundPaymentSchema,
} from "../validators/payment.validator";

import { paymentService } from "../services/payment.service";

class PaymentController {
  async create(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const input =
        createPaymentSchema.parse(
          req.body
        );

      const payment =
        await paymentService.createPayment(
          input,
          req.user!.userId
        );

      res.status(201).json({
        success: true,
        message:
          "Payment created successfully.",
        data: payment,
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
      const payment =
        await paymentService.getPayment(
          String(req.params.paymentId)
        );

      res.status(200).json({
        success: true,
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  }

  async getByBill(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const payments =
        await paymentService.getPaymentsByBill(
          String(req.params.billId)
        );

      res.status(200).json({
        success: true,
        data: payments,
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
          ? String(
              req.query.restaurantId
            )
          : undefined;

      const branchId =
        req.query.branchId
          ? String(req.query.branchId)
          : undefined;

      const status =
        req.query.status
          ? String(
              req.query.status
            ) as any
          : undefined;

      const payments =
        await paymentService.getPayments(
          restaurantId,
          branchId,
          status
        );

      res.status(200).json({
        success: true,
        data: payments,
      });
    } catch (error) {
      next(error);
    }
  }

  async process(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const input =
        processPaymentSchema.parse(
          req.body
        );

      const payment =
        await paymentService.processPayment(
          String(req.params.paymentId),
          input,
          req.user!.userId
        );

      res.status(200).json({
        success: true,
        message:
          "Payment processed successfully.",
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  }

  async fail(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const input =
        failPaymentSchema.parse(
          req.body
        );

      const payment =
        await paymentService.failPayment(
          String(req.params.paymentId),
          input.reason,
          req.user!.userId
        );

      res.status(200).json({
        success: true,
        message:
          "Payment marked as failed.",
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  }

  async refund(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const input =
        refundPaymentSchema.parse(
          req.body
        );

      const payment =
        await paymentService.refundPayment(
          String(req.params.paymentId),
          input,
          req.user!.userId
        );

      res.status(200).json({
        success: true,
        message:
          "Payment refunded successfully.",
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const paymentController =
  new PaymentController();