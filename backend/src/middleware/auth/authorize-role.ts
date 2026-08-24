import { NextFunction, Response } from "express";

import { ForbiddenError, UnauthorizedError } from "../../common/errors";
import { AuthenticatedRequest } from "../../common/interfaces";

export const authorizeRoles = (...allowedRoleIds: string[]) => {
  return (
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError(
          "Authentication required."
        );
      }

      if (!allowedRoleIds.includes(req.user.roleId)) {
        throw new ForbiddenError(
          "You do not have permission to access this resource."
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};