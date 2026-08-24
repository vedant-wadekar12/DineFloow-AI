import { Router } from "express";

import { validateRequest } from "../../../middleware/validation";

import { authController } from "../controllers/auth.controller";

import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from "../validators/auth.validator";

const router = Router();

router.post(
  "/register",
  validateRequest(registerSchema),
  (req, res, next) =>
    authController.register(req, res, next)
);

router.post(
  "/login",
  validateRequest(loginSchema),
  (req, res, next) =>
    authController.login(req, res, next)
);

router.post(
  "/logout",
  validateRequest(refreshTokenSchema),
  (req, res, next) =>
    authController.logout(req, res, next)
);

export default router;