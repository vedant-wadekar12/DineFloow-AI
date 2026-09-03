import { NextFunction, Request, Response } from "express";

import {
  rolePermissionService,
} from "../services/role-permission.service";

export class RolePermissionController {
  async assignPermission(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result =
        await rolePermissionService.assignPermission(
          String(req.params.roleId),
          req.body.permissionId
        );

      return res.status(201).json({
        success: true,
        message: "Permission assigned successfully.",
        data: result ?? null,
      });
    } catch (error) {
      next(error);
    }
  }

  async getRolePermissions(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const permissions =
        await rolePermissionService.getRolePermissions(
          String(req.params.roleId)
        );

      return res.status(200).json({
        success: true,
        message: "Role permissions retrieved successfully.",
        data: permissions,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const rolePermissionController =
  new RolePermissionController();