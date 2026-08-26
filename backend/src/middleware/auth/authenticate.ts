import { NextFunction, Response } from "express";

import { UnauthorizedError } from "../../common/errors";
import { AuthenticatedRequest } from "../../common/interfaces";
import { tokenUtil } from "../../common/utilities";

import { authRepository } from "../../modules/auth/repositories/auth.repository";

export const authenticate = async (
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

    /**
     * Verify JWT signature and expiration
     */
    const payload = tokenUtil.verifyAccessToken(token);

    /**
     * Find the current user
     */
    const user = await authRepository.findById(
      payload.userId
    );

    if (!user || user.isDeleted) {
      throw new UnauthorizedError(
        "User account no longer exists."
      );
    }

    /**
     * Check whether the account is active.
     */
    if (!user.isActive) {
      throw new UnauthorizedError(
        "User account is inactive."
      );
    }

    /**
     * Reject tokens created before
     * the user's password was changed.
     */
    if (user.changedPasswordAfter(payload.iat ?? 0)) {
      throw new UnauthorizedError(
        "Password was changed. Please login again."
      );
    }

    /**
     * Attach authenticated JWT payload
     * to the request.
     */
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