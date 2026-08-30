import { Router } from "express";

import { validateRequest } from "../../../middleware/validation";

import { updateUserSchema } from "../validators/user.validator";


import {
  updateUserRoleSchema,
  updateUserStatusSchema,
} from "../validators/user-management.validator";

import {
  authenticate,
  authorizeUser,
  authorizePermissions,
} from "../../../middleware/auth";



import { userController } from "../controllers/user.controller";

import {
  changePasswordSchema,
} from "../validators/user.validator";

const router = Router();

router.get(
  "/",
  authenticate,
  authorizePermissions("user:read"),
  (req, res, next) =>
    userController.getAllUsers(req, res, next)
);


router.patch(
  "/:userId",
  authenticate,
  authorizeUser,
  validateRequest(updateUserSchema),
  (req, res, next) =>
    userController.updateProfile(req, res, next)
);

router.patch(
  "/:userId/deactivate",
  authenticate,
  authorizeUser,
  (req, res, next) =>
    userController.deactivateAccount(req, res, next)
);

router.patch(
  "/:userId/change-password",
  authenticate,
  authorizeUser,
  validateRequest(changePasswordSchema),
  (req, res, next) =>
    userController.changePassword(req, res, next)
);

router.patch(
  "/:userId/status",
  authenticate,
  authorizePermissions("user:update"),
  validateRequest(updateUserStatusSchema),
  (req, res, next) =>
    userController.updateStatus(req, res, next)
);

router.patch(
  "/:userId/role",
  authenticate,
  authorizePermissions("user:update"),
  validateRequest(updateUserRoleSchema),
  (req, res, next) =>
    userController.updateRole(req, res, next)
);

router.get(
  "/:userId",
  authenticate,
  authorizePermissions("user:read"),
  (req, res, next) =>
    userController.getUserById(req, res, next)
);
router.delete(
  "/:userId",
  authenticate,
  authorizePermissions("user:delete"),
  (req, res, next) =>
    userController.deleteUser(req, res, next)
);

export default router;