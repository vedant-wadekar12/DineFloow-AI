import { Router } from "express";

import {
  authenticate,
  authorizePermissions,
} from "../../../middleware/auth";

import {
  couponController,
} from "../controllers/coupon.controller";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  authorizePermissions("coupon:create"),
  couponController.create
);

router.get(
  "/",
  authorizePermissions("coupon:read"),
  couponController.getAll
);

router.post(
  "/validate",
  authorizePermissions("coupon:read"),
  couponController.validate
);

router.get(
  "/:couponId",
  authorizePermissions("coupon:read"),
  couponController.getById
);

router.patch(
  "/:couponId",
  authorizePermissions("coupon:update"),
  couponController.update
);

router.patch(
  "/:couponId/status",
  authorizePermissions("coupon:update"),
  couponController.updateStatus
);

router.delete(
  "/:couponId",
  authorizePermissions("coupon:delete"),
  couponController.remove
);

export default router;