import { NextFunction, Request, Response } from "express";

import {
  permissionService,
} from "../services/permission.service";

export class PermissionController {
  async getAll(
    _req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const permissions =
        await permissionService.getAll();

      return res.status(200).json({
        success: true,
        message: "Permissions retrieved successfully.",
        data: permissions,
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
      const permission =
        await permissionService.getById(
          String(req.params.permissionId)
        );

      return res.status(200).json({
        success: true,
        message: "Permission retrieved successfully.",
        data: permission,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const permissionController =
  new PermissionController();