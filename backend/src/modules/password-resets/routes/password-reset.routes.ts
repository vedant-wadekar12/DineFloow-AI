import { Router } from "express";

import { validateRequest } from "../../../middleware/validation";

import {
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../../users/validators/user.validator";

import { passwordResetController } from "../controllers/password-reset.controller";

import { passwordResetRateLimit } from "../../../middleware/security/password-reset-rate-limit";

const router = Router();

router.post(
  "/forgot-password",
  validateRequest(forgotPasswordSchema),
  (req, res, next) =>
    passwordResetController.forgotPassword(
      req,
      res,
      next
    )
);

router.post(
  "/reset-password",
  validateRequest(resetPasswordSchema),
  (req, res, next) =>
    passwordResetController.resetPassword(
      req,
      res,
      next
    )
);

router.post(
  "/forgot-password",
  passwordResetRateLimit,
  validateRequest(forgotPasswordSchema),
  (req, res, next) =>
    passwordResetController.forgotPassword(
      req,
      res,
      next
    )
);

export default router;