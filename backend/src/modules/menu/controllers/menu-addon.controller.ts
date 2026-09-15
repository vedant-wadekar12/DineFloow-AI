import {
  NextFunction,
  Request,
  Response,
} from "express";

import { AuthenticatedRequest } from "../../../common/interfaces";

import {
  createMenuAddonSchema,
  updateMenuAddonSchema,
  updateMenuAddonAvailabilitySchema,
} from "../validators/menu-addon.validator";

import {
  menuAddonService,
} from "../services/menu-addon.service";

export class MenuAddonController {
  async create(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data =
        createMenuAddonSchema.parse(
          req.body
        );

      const result =
        await menuAddonService.create(
          data,
          req.user?.userId
        );

      res.status(201).json({
        success: true,
        message:
          "Add-on created successfully.",
        data: result,
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
      const result =
        await menuAddonService.getById(
          String(req.params.addonId)
        );

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getByRestaurant(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result =
        await menuAddonService.getByRestaurant(
          String(req.params.restaurantId)
        );

      res.json({
        success: true,
        data: result,
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
      const data =
        updateMenuAddonSchema.parse(
          req.body
        );

      const result =
        await menuAddonService.update(
          String(req.params.addonId),
          data,
          req.user?.userId
        );

      res.json({
        success: true,
        message:
          "Add-on updated successfully.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateAvailability(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data =
        updateMenuAddonAvailabilitySchema.parse(
          req.body
        );

      const result =
        await menuAddonService.updateAvailability(
          String(req.params.addonId),
          data.isAvailable
        );

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result =
        await menuAddonService.delete(
          String(req.params.addonId)
        );

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const menuAddonController =
  new MenuAddonController();