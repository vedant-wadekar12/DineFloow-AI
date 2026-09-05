import {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  AuthenticatedRequest,
} from "../../../common/interfaces";

import {
  menuItemService,
} from "../services/menu-item.service";

export class MenuItemController {
  async create(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const item =
        await menuItemService.create(
          req.body,
          String(req.user!.userId)
        );

      return res.status(201).json({
        success: true,
        message:
          "Menu item created successfully.",
        data: item,
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
      const items =
        await menuItemService.getAll();

      return res.status(200).json({
        success: true,
        message:
          "Menu items retrieved successfully.",
        data: items,
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
      const item =
        await menuItemService.getById(
          String(req.params.itemId)
        );

      return res.status(200).json({
        success: true,
        message:
          "Menu item retrieved successfully.",
        data: item,
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
      const items =
        await menuItemService.getByRestaurant(
          String(req.params.restaurantId)
        );

      return res.status(200).json({
        success: true,
        message:
          "Restaurant menu items retrieved successfully.",
        data: items,
      });
    } catch (error) {
      next(error);
    }
  }

  async getByBranch(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const items =
        await menuItemService.getByBranch(
          String(req.params.branchId)
        );

      return res.status(200).json({
        success: true,
        message:
          "Branch menu items retrieved successfully.",
        data: items,
      });
    } catch (error) {
      next(error);
    }
  }

  async getByCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const items =
        await menuItemService.getByCategory(
          String(req.params.categoryId)
        );

      return res.status(200).json({
        success: true,
        message:
          "Category menu items retrieved successfully.",
        data: items,
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
      const item =
        await menuItemService.update(
          String(req.params.itemId),
          req.body,
          String(req.user!.userId)
        );

      return res.status(200).json({
        success: true,
        message:
          "Menu item updated successfully.",
        data: item,
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
      const item =
        await menuItemService.updateAvailability(
          String(req.params.itemId),
          req.body.isAvailable
        );

      return res.status(200).json({
        success: true,
        message:
          "Menu item availability updated successfully.",
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const item =
        await menuItemService.updateStatus(
          String(req.params.itemId),
          req.body.isActive
        );

      return res.status(200).json({
        success: true,
        message:
          "Menu item status updated successfully.",
        data: item,
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
      await menuItemService.delete(
        String(req.params.itemId)
      );

      return res.status(200).json({
        success: true,
        message:
          "Menu item deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
}

export const menuItemController =
  new MenuItemController();