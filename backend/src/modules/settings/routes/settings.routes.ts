import { Router } from "express";

import { authenticate } from "../../../middleware/auth/authenticate";
import { authorizePermissions } from "../../../middleware/auth/authorize-permission";

import { SettingsController } from "../controllers/settings.controller";

const router = Router();

const controller = new SettingsController();

router.use(authenticate);

router.get(
  "/restaurant/:restaurantId",
  authorizePermissions("settings:read"),
  controller.getSettings
);

router.patch(
  "/restaurant/:restaurantId",
  authorizePermissions("settings:update"),
  controller.updateSettings
);

export default router;