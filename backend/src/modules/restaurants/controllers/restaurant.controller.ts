import {
  NextFunction,
  Request,
  Response,
} from "express";

import { AuthenticatedRequest } from "../../../common/interfaces";

import {
  restaurantService,
} from "../services/restaurant.service";

export class RestaurantController {
  async create(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const restaurant =
        await restaurantService.create(
          req.body,
          String(req.user!.userId)
        );

      return res.status(201).json({
        success: true,
        message: "Restaurant created successfully.",
        data: restaurant,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(
    _req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const restaurants =
        await restaurantService.getAll();

      return res.status(200).json({
        success: true,
        message: "Restaurants retrieved successfully.",
        data: restaurants,
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
      const restaurant =
        await restaurantService.getById(
          String(req.params.restaurantId)
        );

      return res.status(200).json({
        success: true,
        message: "Restaurant retrieved successfully.",
        data: restaurant,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyRestaurants(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const restaurants =
        await restaurantService.getByOwner(
          String(req.user!.userId)
        );

      return res.status(200).json({
        success: true,
        message: "Your restaurants retrieved successfully.",
        data: restaurants,
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
      const restaurant =
        await restaurantService.update(
          String(req.params.restaurantId),
          req.body,
          String(req.user!.userId)
        );

      return res.status(200).json({
        success: true,
        message: "Restaurant updated successfully.",
        data: restaurant,
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
      const restaurant =
        await restaurantService.updateStatus(
          String(req.params.restaurantId),
          req.body.isActive
        );

      return res.status(200).json({
        success: true,
        message: "Restaurant status updated successfully.",
        data: restaurant,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      await restaurantService.delete(
        String(req.params.restaurantId)
      );

      return res.status(200).json({
        success: true,
        message: "Restaurant deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
}

export const restaurantController =
  new RestaurantController();