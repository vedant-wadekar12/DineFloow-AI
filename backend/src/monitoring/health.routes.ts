import { Router } from "express";

import {
  HealthController,
} from "./health.controller";

const router = Router();

const controller =
  new HealthController();

router.get(
  "/health",
  controller.getHealth
);

router.get(
  "/ready",
  controller.getReadiness
);

export default router;