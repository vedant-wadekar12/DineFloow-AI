import { Router } from "express";

import { validateRequest } from "../../../middleware/validation";
import { authRateLimiter } from "../../../middleware/rate-limit/redis-rate-limiter";
import { authenticate } from "../../../middleware/auth";

import { authController } from "../controllers/auth.controller";
import { userController } from "../../users/controllers/user.controller";

import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from "../validators/auth.validator";

const router = Router();

router.post(
  "/register",
  authRateLimiter,
  validateRequest(registerSchema),
  (req, res, next) =>
    authController.register(req, res, next)
);

router.post(
  "/login",
  authRateLimiter,
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

router.get(
  "/me",
  authenticate,
  (req, res, next) => userController.getProfile(req, res, next)
);

export default router;