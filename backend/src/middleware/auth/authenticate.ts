import { NextFunction, Response } from "express";

import { UnauthorizedError } from "../../common/errors";
import { AuthenticatedRequest } from "../../common/interfaces";
import { tokenUtil } from "../../common/utilities";
import { tenantContext } from "../../common/tenant/tenant-context";

import { authRepository } from "../../modules/auth/repositories/auth.repository";
import { roleRepository } from "../../modules/roles";
 
export const authenticate = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    /**
     * =========================================================
     * STEP 1
     * Read Authorization header
     * =========================================================
     */
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedError(
        "Authentication token is required."
      );
    }

    /**
     * Expected format:
     *
     * Authorization: Bearer <token>
     */
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new UnauthorizedError(
        "Invalid authentication format."
      );
    }

    /**
     * =========================================================
     * STEP 2
     * Verify JWT
     * =========================================================
     *
     * This checks:
     * - JWT signature
     * - JWT expiration
     * - JWT validity
     */
    const payload =
      tokenUtil.verifyAccessToken(token);

    /**
     * =========================================================
     * STEP 3
     * Load CURRENT user from database
     * =========================================================
     *
     * Important:
     *
     * We do NOT trust restaurantId / branchId
     * from the JWT.
     *
     * MongoDB is the source of truth.
     */
    const user =
      await authRepository.findById(
        payload.userId
      );

    /**
     * User must exist.
     */
    if (!user || user.isDeleted) {
      throw new UnauthorizedError(
        "User account no longer exists."
      );
    }

    /**
     * =========================================================
     * STEP 4
     * Check account status
     * =========================================================
     */
    if (!user.isActive) {
      throw new UnauthorizedError(
        "User account is inactive."
      );
    }

    /**
     * =========================================================
     * STEP 5
     * Check password change
     * =========================================================
     *
     * If password was changed after the JWT
     * was created, force the user to login again.
     */
    if (
      user.changedPasswordAfter(
        payload.iat ?? 0
      )
    ) {
      throw new UnauthorizedError(
        "Password was changed. Please login again."
      );
    }

    /**
     * =========================================================
     * STEP 6
     * Load CURRENT role from database
     * =========================================================
     *
     * We don't rely only on the role stored inside
     * the JWT because the database is the current source
     * of truth.
     */
    const role =
      await roleRepository.findById(
        user.roleId
      );

    /**
     * If the user's role no longer exists,
     * authentication should fail.
     */
    if (!role) {
      throw new UnauthorizedError(
        "User role is invalid."
      );
    }

    /**
     * =========================================================
     * STEP 7
     * Determine SUPER_ADMIN
     * =========================================================
     *
     * SUPER_ADMIN is allowed to work across tenants.
     *
     * Normal restaurant users are NOT.
     */
    const isSuperAdmin =
      role.name === "SUPER_ADMIN";

    /**
     * =========================================================
     * STEP 8
     * Attach CURRENT database user information
     * to req.user
     * =========================================================
     *
     * IMPORTANT:
     *
     * restaurantId and branchId come from MongoDB,
     * not from the JWT.
     */
    req.user = {
      ...payload,

      userId:
        user._id.toString(),

      email:
        user.email,

      roleId:
        user.roleId.toString(),

      roleName:
        role.name,

      restaurantId:
        user.restaurantId?.toString(),

      branchId:
        user.branchId?.toString(),
    };

    /**
     * =========================================================
     * STEP 9
     * Create tenant context
     * =========================================================
     *
     * This is the connection between:
     *
     * Logged-in user
     *       ↓
     * Restaurant
     *       ↓
     * Mongoose tenant protection
     */
    return tenantContext.run(
      {
        authenticated: true,

        userId:
          user._id.toString(),

        restaurantId:
          user.restaurantId?.toString(),

        branchId:
          user.branchId?.toString(),

        roleId:
          user.roleId.toString(),

        roleName:
          role.name,

        isSuperAdmin,
      },

      /**
       * Continue to the next Express middleware.
       */
      () => next()
    );
  } catch (error) {
    /**
     * Keep the existing authentication error behavior.
     */
    next(
      error instanceof UnauthorizedError
        ? error
        : new UnauthorizedError(
            "Invalid or expired authentication token."
          )
    );
  }
};