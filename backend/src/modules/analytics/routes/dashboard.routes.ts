import { Router } from "express";

import { authenticate } from "../../../middleware/auth/authenticate";
import { authorizePermissions } from "../../../middleware/auth/authorize-permission";

import { DashboardController } from "../controllers/dashboard.controller";

const router = Router();

const controller = new DashboardController();

router.use(authenticate);

router.get(
  "/",
  authorizePermissions("analytics:read"),
  controller.getDashboard
);

export default router;