import { Router } from "express";

import { ApiResponse } from "../../common/responses";

import authRoutes from "../../modules/auth/routes/auth.routes";

import refreshTokenRoutes from "../../modules/refresh-tokens/routes/refresh-token.routes";

import protectedRoutes from "./protected.routes";

import authorizationTestRoutes from "./authorization-test.routes";

import userRoutes from "../../modules/users/routes/user.routes";

import passwordResetRoutes from "../../modules/password-resets/routes/password-reset.routes";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json(
    new ApiResponse(
      true,
      "DineFlow AI Backend is running",
      {
        timestamp: new Date().toISOString(),
      }
    )
  );
});

router.use("/auth", authRoutes);

router.use("/auth", refreshTokenRoutes);

router.use("/protected", protectedRoutes);

router.use("/authorization-test", authorizationTestRoutes);

router.use("/users", userRoutes);

router.use("/auth", passwordResetRoutes);

export default router;