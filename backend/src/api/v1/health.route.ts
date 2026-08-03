import { Router } from "express";
import mongoose from "mongoose";

import { ApiResponse } from "../../common/responses";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json(
    new ApiResponse(true, "DineFlow AI Backend is healthy", {
      timestamp: new Date().toISOString(),

      uptime: process.uptime(),

      database: {
        connected: mongoose.connection.readyState === 1,
        state: mongoose.connection.readyState,
        name: mongoose.connection.name,
        host: mongoose.connection.host,
      },
    }),
  );
});

export default router;
