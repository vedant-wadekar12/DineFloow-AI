import { Router } from "express";

import {
  authenticate,
  authorizePermissions,
} from "../../../middleware/auth";

import { billingController } from "../controllers/billing.controller";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  authorizePermissions("billing:create"),
  billingController.create
);

router.get(
  "/",
  authorizePermissions("billing:read"),
  billingController.getAll
);

router.get(
  "/order/:orderId",
  authorizePermissions("billing:read"),
  billingController.getByOrder
);

router.get(
  "/:billId",
  authorizePermissions("billing:read"),
  billingController.getById
);

router.patch(
  "/:billId",
  authorizePermissions("billing:update"),
  billingController.update
);

router.post(
  "/:billId/cancel",
  authorizePermissions("billing:update"),
  billingController.cancel
);

export default router;