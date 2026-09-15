import {
  NextFunction,
  Request,
  Response,
} from "express";

import { AuthenticatedRequest } from "../../../common/interfaces";

import {
  createMenuComboSchema,
  updateMenuComboSchema,
  updateMenuComboAvailabilitySchema,
} from "../validators/menu-combo.validator";

import {
  menuComboService,
} from "../services/menu-combo.service";

export class MenuComboController {
  async create(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data =
        createMenuComboSchema.parse(
          req.body
        );

      const combo =
        await menuComboService.create(
          data,
          req.user?.userId
        );

      return res.status(201).json({
        success: true,
        message:
          "Menu combo created successfully.",
        data: combo,
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
      const combos =
        await menuComboService.getByRestaurant(
          String(req.params.restaurantId)
        );

      return res.status(200).json({
        success: true,
        data: combos,
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
      const combo =
        await menuComboService.getById(
          String(req.params.comboId)
        );

      return res.status(200).json({
        success: true,
        data: combo,
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
        updateMenuComboSchema.parse(
          req.body
        );

      const combo =
        await menuComboService.update(
          String(req.params.comboId),
          data,
          req.user?.userId
        );

      return res.status(200).json({
        success: true,
        message:
          "Menu combo updated successfully.",
        data: combo,
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
        updateMenuComboAvailabilitySchema.parse(
          req.body
        );

      const combo =
        await menuComboService.updateAvailability(
          String(req.params.comboId),
          data.isAvailable
        );

      return res.status(200).json({
        success: true,
        message:
          "Menu combo availability updated successfully.",
        data: combo,
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
        await menuComboService.delete(
          String(req.params.comboId)
        );

      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const menuComboController =
  new MenuComboController();