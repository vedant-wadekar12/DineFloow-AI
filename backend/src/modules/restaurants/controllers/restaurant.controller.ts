import {
  NextFunction,
  Response,
} from "express";

import { AuthenticatedRequest } from "../../../common/interfaces";

import {
  restaurantService,
} from "../services/restaurant.service";

export class RestaurantController {
  /**
   * =========================================================
   * OWNER CREATE
   * =========================================================
   */
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
        message:
          "Restaurant created successfully.",
        data: restaurant,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * =========================================================
   * OWNER GET ALL
   * =========================================================
   */
  async getAll(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const restaurants =
        await restaurantService.getAll(
          String(req.user!.userId)
        );

      return res.status(200).json({
        success: true,
        message:
          "Restaurants retrieved successfully.",
        data: restaurants,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * =========================================================
   * OWNER GET BY ID
   * =========================================================
   */
  async getById(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const restaurant =
        await restaurantService.getById(
          String(req.params.restaurantId),
          String(req.user!.userId)
        );

      return res.status(200).json({
        success: true,
        message:
          "Restaurant retrieved successfully.",
        data: restaurant,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * =========================================================
   * OWNER GET MY RESTAURANTS
   * =========================================================
   */
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
        message:
          "Your restaurants retrieved successfully.",
        data: restaurants,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * =========================================================
   * OWNER UPDATE
   * =========================================================
   */
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
        message:
          "Restaurant updated successfully.",
        data: restaurant,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * =========================================================
   * OWNER STATUS UPDATE
   * =========================================================
   */
  async updateStatus(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const restaurant =
        await restaurantService.updateStatus(
          String(req.params.restaurantId),
          req.body.isActive,
          String(req.user!.userId)
        );

      return res.status(200).json({
        success: true,
        message:
          "Restaurant status updated successfully.",
        data: restaurant,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * =========================================================
   * SUPER ADMIN GET ALL
   * =========================================================
   */
  async getAllAsSuperAdmin(
    _req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const restaurants =
        await restaurantService.getAllAsSuperAdmin();

      return res.status(200).json({
        success: true,
        message:
          "All restaurants retrieved successfully.",
        data: restaurants,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * =========================================================
   * SUPER ADMIN GET BY ID
   * =========================================================
   */
  async getByIdAsSuperAdmin(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const restaurant =
        await restaurantService.getByIdAsSuperAdmin(
          String(req.params.restaurantId)
        );

      return res.status(200).json({
        success: true,
        message:
          "Restaurant retrieved successfully.",
        data: restaurant,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * =========================================================
   * SUPER ADMIN STATUS UPDATE
   * =========================================================
   */
  async updateStatusAsSuperAdmin(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const restaurant =
        await restaurantService.updateStatusAsSuperAdmin(
          String(req.params.restaurantId),
          req.body.isActive
        );

      return res.status(200).json({
        success: true,
        message:
          "Restaurant status updated successfully by platform administrator.",
        data: restaurant,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * =========================================================
   * OWNER DELETE
   * =========================================================
   */
  async delete(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      await restaurantService.delete(
        String(req.params.restaurantId),
        String(req.user!.userId)
      );

      return res.status(200).json({
        success: true,
        message:
          "Restaurant deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
}

export const restaurantController =
  new RestaurantController();