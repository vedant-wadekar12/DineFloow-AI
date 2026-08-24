import { NextFunction, Response } from "express";

import {
  ForbiddenError,
  UnauthorizedError,
} from "../../common/errors";

import { AuthenticatedRequest } from "../../common/interfaces";

import { permissionRepository } from "../../modules/permissions";

import { rolePermissionRepository } from "../../modules/role-permissions";

export const authorizePermissions = (
  ...permissionNames: string[]
) => {
  return async (
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction
  ) => {
    try {
      /**
       * User must be authenticated first
       */
      if (!req.user) {
        throw new UnauthorizedError(
          "Authentication required."
        );
      }

      /**
       * Get user's role
       */
      const roleId = req.user.roleId;

      /**
       * Check every requested permission
       */
      for (const permissionName of permissionNames) {
        /**
         * Find permission by name
         */
        const permission =
          await permissionRepository.findByName(
            permissionName
          );

        if (!permission) {
          throw new ForbiddenError(
            `Permission "${permissionName}" does not exist.`
          );
        }

        /**
         * Check whether user's role
         * has this permission
         */
        const hasPermission =
          await rolePermissionRepository.hasPermission(
            roleId,
            permission._id
          );

        if (!hasPermission) {
          throw new ForbiddenError(
            "You do not have permission to access this resource."
          );
        }
      }

      /**
       * All permissions passed
       */
      next();
    } catch (error) {
      next(error);
    }
  };
};