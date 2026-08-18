import { Router } from "express";

import { ApiResponse } from "../../common/responses";
import { authRoutes } from "../../modules/auth";

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

export default router;