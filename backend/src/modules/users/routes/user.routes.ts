import { Router } from "express";

import { validateRequest } from "../../../middleware/validation";

import { updateUserSchema } from "../validators/user.validator";

import {
  authenticate,
  authorizeUser,
} from "../../../middleware/auth";



import { userController } from "../controllers/user.controller";

import {
  changePasswordSchema,
} from "../validators/user.validator";

const router = Router();

router.get(
  "/:userId",
  authenticate,
  authorizeUser,
  (req, res, next) =>
    userController.getProfile(req, res, next)
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

export default router;