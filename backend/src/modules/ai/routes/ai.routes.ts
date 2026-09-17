import { Router } from "express";

import { authenticate } from "../../../middleware/auth/authenticate";
import { authorizePermissions } from "../../../middleware/auth/authorize-permission";

import { AIController } from "../controllers/ai.controller";

const router = Router();

const controller = new AIController();

router.get(
  "/recommendations",
  authenticate,
  authorizePermissions("ai:read"),
  controller.getRecommendations
);

router.get(
  "/popular",
  authenticate,
  authorizePermissions("ai:read"),
  controller.getPopularItems
);

router.get(
  "/special-dish",
  authenticate,
  authorizePermissions("ai:read"),
  controller.getSpecialDish
);

router.post(
  "/special-dish",
  authenticate,
  authorizePermissions("ai:update"),
  controller.setSpecialDish
);

export default router;