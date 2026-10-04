import { Router } from "express";

import { validateRequest } from "../../../middleware/validation";

import {
  updateUserSchema,
  changePasswordSchema,
} from "../validators/user.validator";

import {
  updateUserRoleSchema,
  updateUserStatusSchema,
} from "../validators/user-management.validator";

import {
  authenticate,
  authorizeUser,
  authorizePermissions,
  requireActiveRestaurant,
} from "../../../middleware/auth";

import { userController } from "../controllers/user.controller";

const router = Router();

/**
 * =========================================================
 * USER MANAGEMENT
 * =========================================================
 *
 * SUPER_ADMIN bypasses requireActiveRestaurant internally.
 *
 * Restaurant users are blocked when their restaurant is
 * inactive.
 */

/**
 * Get users.
 */
router.get(
  "/",
  authenticate,
  requireActiveRestaurant,
  authorizePermissions("user:read"),
  (req, res, next) =>
    userController.getAllUsers(
      req,
      res,
      next,
    ),
);

/**
 * Update own profile.
 */
router.patch(
  "/:userId",
  authenticate,
  requireActiveRestaurant,
  authorizeUser,
  validateRequest(updateUserSchema),
  (req, res, next) =>
    userController.updateProfile(
      req,
      res,
      next,
    ),
);

/**
 * Deactivate own account.
 */
router.patch(
  "/:userId/deactivate",
  authenticate,
  requireActiveRestaurant,
  authorizeUser,
  (req, res, next) =>
    userController.deactivateAccount(
      req,
      res,
      next,
    ),
);

/**
 * Change own password.
 */
router.patch(
  "/:userId/change-password",
  authenticate,
  requireActiveRestaurant,
  authorizeUser,
  validateRequest(changePasswordSchema),
  (req, res, next) =>
    userController.changePassword(
      req,
      res,
      next,
    ),
);

/**
 * Activate / deactivate a user.
 */
router.patch(
  "/:userId/status",
  authenticate,
  requireActiveRestaurant,
  authorizePermissions("user:update"),
  validateRequest(updateUserStatusSchema),
  (req, res, next) =>
    userController.updateStatus(
      req,
      res,
      next,
    ),
);

/**
 * Change user role.
 */
router.patch(
  "/:userId/role",
  authenticate,
  requireActiveRestaurant,
  authorizePermissions("user:update"),
  validateRequest(updateUserRoleSchema),
  (req, res, next) =>
    userController.updateRole(
      req,
      res,
      next,
    ),
);

/**
 * Get user by ID.
 */
router.get(
  "/:userId",
  authenticate,
  requireActiveRestaurant,
  authorizePermissions("user:read"),
  (req, res, next) =>
    userController.getUserById(
      req,
      res,
      next,
    ),
);

/**
 * Delete user.
 */
router.delete(
  "/:userId",
  authenticate,
  requireActiveRestaurant,
  authorizePermissions("user:delete"),
  (req, res, next) =>
    userController.deleteUser(
      req,
      res,
      next,
    ),
);

export default router;