import { Router } from "express";

import { ApiResponse } from "../../common/responses";
import authRoutes from "../../modules/auth/routes/auth.routes";
import refreshTokenRoutes from "../../modules/refresh-tokens/routes/refresh-token.routes";

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

export default router;