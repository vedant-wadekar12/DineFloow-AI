import { Router } from "express";

import { authenticate } from "../../../middleware/auth/authenticate";
import { authorizePermissions } from "../../../middleware/auth/authorize-permission";

import { AnalyticsController } from "../controllers/analytics.controller";

const router = Router();

const controller = new AnalyticsController();

router.use(authenticate);

router.get(
  "/orders",
  authorizePermissions("analytics:read"),
  controller.getOrderStatistics
);

router.get(
  "/orders/status",
  authorizePermissions("analytics:read"),
  controller.getOrderStatuses
);

router.get(
  "/revenue/daily",
  authorizePermissions("analytics:read"),
  controller.getDailyRevenue
);

router.get(
  "/menu/top-items",
  authorizePermissions("analytics:read"),
  controller.getTopItems
);

router.get(
  "/payments",
  authorizePermissions("analytics:read"),
  controller.getPayments
);

router.get(
  "/customers",
  authorizePermissions("analytics:read"),
  controller.getCustomers
);

router.get(
  "/menu",
  authorizePermissions("analytics:read"),
  controller.getMenu
);

export default router;