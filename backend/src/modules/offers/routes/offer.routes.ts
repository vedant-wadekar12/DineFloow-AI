import { Router } from "express";

import {
  authenticate,
  authorizePermissions,
} from "../../../middleware/auth";

import {
  offerController,
} from "../controllers/offer.controller";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  authorizePermissions("offer:create"),
  offerController.create
);

router.get(
  "/",
  authorizePermissions("offer:read"),
  offerController.getAll
);

router.post(
  "/calculate",
  authorizePermissions("offer:read"),
  offerController.calculate
);

router.get(
  "/:offerId",
  authorizePermissions("offer:read"),
  offerController.getById
);

router.patch(
  "/:offerId",
  authorizePermissions("offer:update"),
  offerController.update
);

router.patch(
  "/:offerId/status",
  authorizePermissions("offer:update"),
  offerController.updateStatus
);

router.delete(
  "/:offerId",
  authorizePermissions("offer:delete"),
  offerController.remove
);

export default router;