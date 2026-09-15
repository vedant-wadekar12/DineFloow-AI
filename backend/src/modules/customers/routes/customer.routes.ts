import { Router } from "express";

import {
  authenticate,
  authorizePermissions,
} from "../../../middleware/auth";

import {
  customerController,
} from "../controllers/customer.controller";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  authorizePermissions("user:create"),
  customerController.create
);

router.get(
  "/",
  authorizePermissions("user:read"),
  customerController.getAll
);

router.get(
  "/restaurant/:restaurantId",
  authorizePermissions("user:read"),
  customerController.getByRestaurant
);

router.get(
  "/restaurant/:restaurantId/phone/:phone",
  authorizePermissions("user:read"),
  customerController.getByPhone
);

router.get(
  "/:customerId",
  authorizePermissions("user:read"),
  customerController.getById
);

router.patch(
  "/:customerId",
  authorizePermissions("user:update"),
  customerController.update
);

router.patch(
  "/:customerId/status",
  authorizePermissions("user:update"),
  customerController.updateStatus
);

router.delete(
  "/:customerId",
  authorizePermissions("user:delete"),
  customerController.delete
);

export default router;