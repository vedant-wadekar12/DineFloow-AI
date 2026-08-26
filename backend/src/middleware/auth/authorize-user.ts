import { NextFunction, Response } from "express";

import {
  ForbiddenError,
  UnauthorizedError,
} from "../../common/errors";

import { AuthenticatedRequest } from "../../common/interfaces";

export const authorizeUser = (
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

    const requestedUserId = req.params.userId;

    if (!requestedUserId) {
      throw new ForbiddenError(
        "User ID is required."
      );
    }

    if (req.user.userId !== requestedUserId) {
      throw new ForbiddenError(
        "You can only access your own user account."
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};