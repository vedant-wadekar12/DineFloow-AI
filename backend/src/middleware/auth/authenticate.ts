import { NextFunction, Response } from "express";

import { UnauthorizedError } from "../../common/errors";
import { AuthenticatedRequest } from "../../common/interfaces";
import { tokenUtil } from "../../common/utilities";

export const authenticate = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedError(
        "Authentication token is required."
      );
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new UnauthorizedError(
        "Invalid authentication format."
      );
    }

    const payload = tokenUtil.verifyAccessToken(token);

    req.user = payload;

    next();
  } catch (error) {
    next(
      error instanceof UnauthorizedError
        ? error
        : new UnauthorizedError(
            "Invalid or expired authentication token."
          )
    );
  }
};