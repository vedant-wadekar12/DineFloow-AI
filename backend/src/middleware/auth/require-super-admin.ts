import { NextFunction, Response } from "express";
import { ForbiddenError, UnauthorizedError } from "../../common/errors";
import { AuthenticatedRequest } from "../../common/interfaces";

export const requireSuperAdmin = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError("Authentication required.");
    }

    if (req.user.roleName !== "SUPER_ADMIN") {
      throw new ForbiddenError("Super administrator access required.");
    }

    next();
  } catch (error) {
    next(error);
  }
};
