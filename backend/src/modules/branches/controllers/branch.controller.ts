import {
  NextFunction,
  Request,
  Response,
} from "express";

import { AuthenticatedRequest } from "../../../common/interfaces";

import {
  branchService,
} from "../services/branch.service";

export class BranchController {
  async create(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const branch =
        await branchService.create(
          req.body,
          String(req.user!.userId)
        );

      return res.status(201).json({
        success: true,
        message: "Branch created successfully.",
        data: branch,
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
      const branches =
        await branchService.getAll();

      return res.status(200).json({
        success: true,
        message: "Branches retrieved successfully.",
        data: branches,
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
      const branch =
        await branchService.getById(
          String(req.params.branchId)
        );

      return res.status(200).json({
        success: true,
        message: "Branch retrieved successfully.",
        data: branch,
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
      const branches =
        await branchService.getByRestaurant(
          String(req.params.restaurantId)
        );

      return res.status(200).json({
        success: true,
        message:
          "Restaurant branches retrieved successfully.",
        data: branches,
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
      const branch =
        await branchService.update(
          String(req.params.branchId),
          req.body,
          String(req.user!.userId)
        );

      return res.status(200).json({
        success: true,
        message: "Branch updated successfully.",
        data: branch,
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
      const branch =
        await branchService.updateStatus(
          String(req.params.branchId),
          req.body.isActive
        );

      return res.status(200).json({
        success: true,
        message:
          "Branch status updated successfully.",
        data: branch,
      });
    } catch (error) {
      next(error);
    }
  }

  async assignManager(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const branch =
        await branchService.assignManager(
          String(req.params.branchId),
          req.body.managerId
        );

      return res.status(200).json({
        success: true,
        message:
          "Branch manager assigned successfully.",
        data: branch,
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
      await branchService.delete(
        String(req.params.branchId)
      );

      return res.status(200).json({
        success: true,
        message: "Branch deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
}

export const branchController =
  new BranchController();