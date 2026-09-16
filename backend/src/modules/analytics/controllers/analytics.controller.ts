import {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  analyticsQuerySchema,
  dateRangeSchema,
} from "../validators/analytics.validator";

import { AnalyticsService } from "../services/analytics.service";

export class AnalyticsController {
  constructor(
    private readonly service = new AnalyticsService()
  ) {}

  getOrderStatistics = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const query =
        analyticsQuerySchema.parse(req.query);

      const data =
        await this.service.getOrderStatistics(
          query.restaurantId,
          query.branchId,
          query.startDate,
          query.endDate
        );

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  getOrderStatuses = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const query =
        analyticsQuerySchema.parse(req.query);

      const data =
        await this.service.getOrderStatusStatistics(
          query.restaurantId,
          query.branchId
        );

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  getDailyRevenue = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const query =
        dateRangeSchema.parse(req.query);

      const data =
        await this.service.getDailyRevenue(
          query.restaurantId,
          query.branchId,
          query.startDate,
          query.endDate
        );

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  getTopItems = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const query =
        analyticsQuerySchema.parse(req.query);

      const data =
        await this.service.getTopMenuItems(
          query.restaurantId,
          query.branchId
        );

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  getPayments = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const query =
        analyticsQuerySchema.parse(req.query);

      const data =
        await this.service.getPaymentStatistics(
          query.restaurantId,
          query.branchId
        );

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  getCustomers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const query =
        analyticsQuerySchema.parse(req.query);

      const data =
        await this.service.getCustomerStatistics(
          query.restaurantId,
          query.branchId
        );

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  getMenu = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const query =
        analyticsQuerySchema.parse(req.query);

      const data =
        await this.service.getMenuStatistics(
          query.restaurantId,
          query.branchId
        );

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}