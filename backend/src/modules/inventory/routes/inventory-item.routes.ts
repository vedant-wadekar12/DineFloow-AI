import { Router } from "express";

import {
  authenticate,
  authorizePermissions,
} from "../../../middleware/auth";

import {
  inventoryItemController,
} from "../controllers/inventory-item.controller";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  authorizePermissions("inventory:create"),
  inventoryItemController.create
);

router.get(
  "/restaurant/:restaurantId",
  authorizePermissions("inventory:read"),
  inventoryItemController.getByRestaurant
);

router.get(
  "/restaurant/:restaurantId/low-stock",
  authorizePermissions("inventory:read"),
  inventoryItemController.getLowStock
);

router.get(
  "/branch/:branchId",
  authorizePermissions("inventory:read"),
  inventoryItemController.getByBranch
);

router.get(
  "/:inventoryItemId",
  authorizePermissions("inventory:read"),
  inventoryItemController.getById
);

router.patch(
  "/:inventoryItemId",
  authorizePermissions("inventory:update"),
  inventoryItemController.update
);

router.delete(
  "/:inventoryItemId",
  authorizePermissions("inventory:delete"),
  inventoryItemController.delete
);

export default router;