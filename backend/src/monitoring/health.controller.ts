import {
  Request,
  Response,
  NextFunction,
} from "express";

import { HealthService } from "./health.service";

export class HealthController {
  constructor(
    private readonly service =
      new HealthService()
  ) {}

  getHealth = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const health =
        await this.service.getHealth();

      const statusCode =
        health.status === "healthy"
          ? 200
          : 503;

      res.status(statusCode).json({
        success:
          health.status === "healthy",

        data: health,
      });
    } catch (error) {
      next(error);
    }
  };
}