import {
  NextFunction,
  Request,
  Response,
} from "express";

import { AuthenticatedRequest } from "../../../common/interfaces";

import {
  createMenuRecipeSchema,
  updateMenuRecipeSchema,
} from "../validators/menu-recipe.validator";

import {
  menuRecipeService,
} from "../services/menu-recipe.service";

export class MenuRecipeController {
  async create(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data =
        createMenuRecipeSchema.parse(
          req.body
        );

      const result =
        await menuRecipeService.create(
          data,
          req.user?.userId
        );

      res.status(201).json({
        success: true,
        message:
          "Menu recipe created successfully.",
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
        await menuRecipeService.getByMenuItem(
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
        updateMenuRecipeSchema.parse(
          req.body
        );

      const result =
        await menuRecipeService.update(
          String(req.params.recipeId),
          data,
          req.user?.userId
        );

      res.json({
        success: true,
        message:
          "Menu recipe updated successfully.",
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
        await menuRecipeService.delete(
          String(req.params.recipeId)
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

export const menuRecipeController =
  new MenuRecipeController();