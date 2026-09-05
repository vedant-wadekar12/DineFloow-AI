import {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  AuthenticatedRequest,
} from "../../../common/interfaces";

import {
  categoryService,
} from "../services/category.service";

export class CategoryController {
  async create(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const category =
        await categoryService.create(
          req.body,
          String(req.user!.userId)
        );

      return res.status(201).json({
        success: true,
        message:
          "Category created successfully.",
        data: category,
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
      const categories =
        await categoryService.getAll();

      return res.status(200).json({
        success: true,
        message:
          "Categories retrieved successfully.",
        data: categories,
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
      const category =
        await categoryService.getById(
          String(req.params.categoryId)
        );

      return res.status(200).json({
        success: true,
        message:
          "Category retrieved successfully.",
        data: category,
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
      const categories =
        await categoryService.getByRestaurant(
          String(req.params.restaurantId)
        );

      return res.status(200).json({
        success: true,
        message:
          "Restaurant categories retrieved successfully.",
        data: categories,
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
      const categories =
        await categoryService.getByBranch(
          String(req.params.branchId)
        );

      return res.status(200).json({
        success: true,
        message:
          "Branch categories retrieved successfully.",
        data: categories,
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
      const category =
        await categoryService.update(
          String(req.params.categoryId),
          req.body,
          String(req.user!.userId)
        );

      return res.status(200).json({
        success: true,
        message:
          "Category updated successfully.",
        data: category,
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
      const category =
        await categoryService.updateStatus(
          String(req.params.categoryId),
          req.body.isActive
        );

      return res.status(200).json({
        success: true,
        message:
          "Category status updated successfully.",
        data: category,
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
      await categoryService.delete(
        String(req.params.categoryId)
      );

      return res.status(200).json({
        success: true,
        message:
          "Category deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
}

export const categoryController =
  new CategoryController();