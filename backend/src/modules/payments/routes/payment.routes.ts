import { Router } from "express";

import {
  authenticate,
  authorizePermissions,
} from "../../../middleware/auth";

import { paymentController } from "../controllers/payment.controller";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  authorizePermissions("payment:create"),
  paymentController.create
);

router.get(
  "/",
  authorizePermissions("payment:read"),
  paymentController.getAll
);

router.get(
  "/bill/:billId",
  authorizePermissions("payment:read"),
  paymentController.getByBill
);

router.get(
  "/:paymentId",
  authorizePermissions("payment:read"),
  paymentController.getById
);

router.patch(
  "/:paymentId/process",
  authorizePermissions("payment:update"),
  paymentController.process
);

router.patch(
  "/:paymentId/fail",
  authorizePermissions("payment:update"),
  paymentController.fail
);

router.post(
  "/:paymentId/refund",
  authorizePermissions("payment:update"),
  paymentController.refund
);

export default router;