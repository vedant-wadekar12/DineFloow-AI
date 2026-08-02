import { Router } from "express";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "DineFlow AI Backend is running",
    timestamp: new Date().toISOString(),
  });
});

export default router;