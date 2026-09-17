import {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  BadRequestError,
} from "../../../common/errors";

import { AIService } from "../services/ai.service";

import {
  recommendationQuerySchema,
  specialDishSchema,
} from "../validators/ai.validator";

export class AIController {
  constructor(
    private readonly service = new AIService()
  ) {}

  getRecommendations = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const parsed =
        recommendationQuerySchema.safeParse(
          req.query
        );

      if (!parsed.success) {
        throw new BadRequestError(
          parsed.error.issues
            .map((issue) => issue.message)
            .join(", ")
        );
      }

      const recommendations =
        await this.service.getRecommendations(
          parsed.data.restaurantId,
          parsed.data.customerId,
          parsed.data.limit
        );

      res.status(200).json({
        success: true,
        data: recommendations,
      });
    } catch (error) {
      next(error);
    }
  };

  getPopularItems = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const parsed =
        recommendationQuerySchema.safeParse(
          req.query
        );

      if (!parsed.success) {
        throw new BadRequestError(
          parsed.error.issues
            .map((issue) => issue.message)
            .join(", ")
        );
      }

      const items =
        await this.service.getPopularRecommendations(
          parsed.data.restaurantId,
          parsed.data.limit
        );

      res.status(200).json({
        success: true,
        data: items,
      });
    } catch (error) {
      next(error);
    }
  };

  getSpecialDish = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const restaurantId =
        typeof req.query.restaurantId ===
        "string"
          ? req.query.restaurantId
          : "";

      if (!restaurantId) {
        throw new BadRequestError(
          "restaurantId is required."
        );
      }

      const item =
        await this.service.getSpecialDish(
          restaurantId
        );

      res.status(200).json({
        success: true,
        data: item,
      });
    } catch (error) {
      next(error);
    }
  };

  setSpecialDish = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const parsed =
        specialDishSchema.safeParse({
          restaurantId:
            req.body.restaurantId,
          menuItemId:
            req.body.menuItemId,
        });

      if (!parsed.success) {
        throw new BadRequestError(
          parsed.error.issues
            .map((issue) => issue.message)
            .join(", ")
        );
      }

      const item =
        await this.service.setSpecialDish(
          parsed.data.restaurantId,
          parsed.data.menuItemId
        );

      res.status(200).json({
        success: true,
        message:
          "Special dish validated successfully.",
        data: item,
      });
    } catch (error) {
      next(error);
    }
  };
}