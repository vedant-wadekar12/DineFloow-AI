import {
  NextFunction,
  Request,
  Response,
} from "express";

import { analyticsQuerySchema } from "../validators/analytics.validator";
import { AnalyticsService } from "../services/analytics.service";

export class DashboardController {
  constructor(
    private readonly service = new AnalyticsService()
  ) {}

  getDashboard = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const query =
        analyticsQuerySchema.parse(req.query);

      const data =
        await this.service.getDashboard(
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