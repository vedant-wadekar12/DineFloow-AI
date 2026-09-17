import { NextFunction, Request, Response } from "express";

import { BadRequestError } from "../../../common/errors";

import { ReportsService } from "../services/reports.service";
import { reportQuerySchema } from "../validators/reports.validator";

export class ReportsController {
  constructor(
    private readonly service = new ReportsService()
  ) {}

  private getRestaurantId(req: Request): string {
    const restaurantId = req.query.restaurantId;

    if (
      typeof restaurantId !== "string" ||
      !restaurantId
    ) {
      throw new BadRequestError(
        "restaurantId is required."
      );
    }

    return restaurantId;
  }

  private getQuery(req: Request) {
    const parsed = reportQuerySchema.safeParse({
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      branchId: req.query.branchId,
    });

    if (!parsed.success) {
      throw new BadRequestError(
        parsed.error.issues
          .map((issue) => issue.message)
          .join(", ")
      );
    }

    return parsed.data;
  }

  getSalesReport = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const restaurantId =
        this.getRestaurantId(req);

      const query = this.getQuery(req);

      const report =
        await this.service.getSalesReport(
          restaurantId,
          query.startDate,
          query.endDate,
          query.branchId
        );

      res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error) {
      next(error);
    }
  };

  getDailySalesReport = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const restaurantId =
        this.getRestaurantId(req);

      const query = this.getQuery(req);

      const report =
        await this.service.getDailySalesReport(
          restaurantId,
          query.startDate,
          query.endDate,
          query.branchId
        );

      res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error) {
      next(error);
    }
  };

  getPaymentReport = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const restaurantId =
        this.getRestaurantId(req);

      const query = this.getQuery(req);

      const report =
        await this.service.getPaymentReport(
          restaurantId,
          query.startDate,
          query.endDate,
          query.branchId
        );

      res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error) {
      next(error);
    }
  };

  getTopItemsReport = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const restaurantId =
        this.getRestaurantId(req);

      const query = this.getQuery(req);

      const report =
        await this.service.getTopItemsReport(
          restaurantId,
          query.startDate,
          query.endDate,
          query.branchId
        );

      res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error) {
      next(error);
    }
  };

  getOrderStatusReport = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const restaurantId =
        this.getRestaurantId(req);

      const query = this.getQuery(req);

      const report =
        await this.service.getOrderStatusReport(
          restaurantId,
          query.startDate,
          query.endDate,
          query.branchId
        );

      res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error) {
      next(error);
    }
  };

  getCustomerReport = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const restaurantId =
        this.getRestaurantId(req);

      const query = this.getQuery(req);

      const report =
        await this.service.getCustomerReport(
          restaurantId,
          query.startDate,
          query.endDate,
          query.branchId
        );

      res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error) {
      next(error);
    }
  };

  getCompleteReport = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const restaurantId =
        this.getRestaurantId(req);

      const query = this.getQuery(req);

      const report =
        await this.service.getCompleteReport(
          restaurantId,
          query.startDate,
          query.endDate,
          query.branchId
        );

      res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error) {
      next(error);
    }
  };
}