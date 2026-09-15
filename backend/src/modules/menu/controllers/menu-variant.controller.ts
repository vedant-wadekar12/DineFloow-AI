import {
  NextFunction,
  Request,
  Response,
} from "express";

import { AuthenticatedRequest } from "../../../common/interfaces";

import {
  createMenuVariantSchema,
  updateMenuVariantSchema,
  updateMenuVariantAvailabilitySchema,
} from "../validators/menu-variant.validator";

import {
  menuVariantService,
} from "../services/menu-variant.service";

export class MenuVariantController {
  async create(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data =
        createMenuVariantSchema.parse(
          req.body
        );

      const result =
        await menuVariantService.create(
          data,
          req.user?.userId
        );

      res.status(201).json({
        success: true,
        message:
          "Menu variant created successfully.",
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
        await menuVariantService.getById(
          String(req.params.variantId)
        );

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getByMenuItem(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result =
        await menuVariantService.getByMenuItem(
          String(req.params.menuItemId)
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
        updateMenuVariantSchema.parse(
          req.body
        );

      const result =
        await menuVariantService.update(
          String(req.params.variantId),
          data,
          req.user?.userId
        );

      res.json({
        success: true,
        message:
          "Menu variant updated successfully.",
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
        updateMenuVariantAvailabilitySchema.parse(
          req.body
        );

      const result =
        await menuVariantService.updateAvailability(
          String(req.params.variantId),
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
        await menuVariantService.delete(
          String(req.params.variantId)
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

export const menuVariantController =
  new MenuVariantController();