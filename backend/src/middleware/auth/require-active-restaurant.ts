import { NextFunction, Response } from "express";

import {
  ForbiddenError,
  UnauthorizedError,
} from "../../common/errors";

import { AuthenticatedRequest } from "../../common/interfaces";

import { restaurantRepository } from "../../modules/restaurants/repositories/restaurant.repository";

export const requireActiveRestaurant = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError(
        "Authentication is required.",
      );
    }

    // SUPER_ADMIN is a platform-level account and must be
    // able to manage inactive restaurants.
    if (req.user.roleName === "SUPER_ADMIN") {
      next();
      return;
    }

    const restaurantId = req.user.restaurantId;

    if (!restaurantId) {
      throw new ForbiddenError(
        "No restaurant is assigned to this account.",
      );
    }

    const restaurant =
      await restaurantRepository.findById(restaurantId);

    if (!restaurant) {
      throw new ForbiddenError(
        "Restaurant is no longer available.",
      );
    }

    if (!restaurant.isActive) {
      throw new ForbiddenError(
        "Restaurant account is inactive. Access has been disabled.",
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};