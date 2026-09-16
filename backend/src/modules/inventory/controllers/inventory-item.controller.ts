import {
  NextFunction,
  Request,
  Response,
} from "express";

import { AuthenticatedRequest } from "../../../common/interfaces";

import {
  createInventoryItemSchema,
  updateInventoryItemSchema,
} from "../validators/inventory-item.validator";

import {
  inventoryItemService,
} from "../services/inventory-item.service";

export class InventoryItemController {
  async create(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data =
        createInventoryItemSchema.parse(
          req.body
        );

      const result =
        await inventoryItemService.create(
          data,
          req.user?.userId
        );

      res.status(201).json({
        success: true,
        message:
          "Inventory item created successfully.",
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
        await inventoryItemService.getById(
          String(req.params.inventoryItemId)
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
        await inventoryItemService.getByRestaurant(
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

  async getByBranch(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result =
        await inventoryItemService.getByBranch(
          String(req.params.branchId)
        );

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getLowStock(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result =
        await inventoryItemService.getLowStock(
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
        updateInventoryItemSchema.parse(
          req.body
        );

      const result =
        await inventoryItemService.update(
          String(req.params.inventoryItemId),
          data,
          req.user?.userId
        );

      res.json({
        success: true,
        message:
          "Inventory item updated successfully.",
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
        await inventoryItemService.delete(
          String(req.params.inventoryItemId)
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

export const inventoryItemController =
  new InventoryItemController();