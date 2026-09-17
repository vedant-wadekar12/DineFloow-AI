import { Router } from "express";

import { authenticate } from "../../../middleware/auth/authenticate";
import { authorizePermissions } from "../../../middleware/auth/authorize-permission";

import { ReportsController } from "../controllers/reports.controller";

const router = Router();

const controller = new ReportsController();

router.use(authenticate);

router.get(
  "/sales",
  authorizePermissions("report:read"),
  controller.getSalesReport
);

router.get(
  "/sales/daily",
  authorizePermissions("report:read"),
  controller.getDailySalesReport
);

router.get(
  "/payments",
  authorizePermissions("report:read"),
  controller.getPaymentReport
);

router.get(
  "/top-items",
  authorizePermissions("report:read"),
  controller.getTopItemsReport
);

router.get(
  "/orders/status",
  authorizePermissions("report:read"),
  controller.getOrderStatusReport
);

router.get(
  "/customers",
  authorizePermissions("report:read"),
  controller.getCustomerReport
);

router.get(
  "/complete",
  authorizePermissions("report:read"),
  controller.getCompleteReport
);

export default router;