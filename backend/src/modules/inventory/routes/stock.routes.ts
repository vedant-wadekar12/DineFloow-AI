import { Router } from "express";

import {
  authenticate,
  authorizePermissions,
} from "../../../middleware/auth";

import {
  stockController,
} from "../controllers/stock.controller";

const router = Router();

router.use(authenticate);

router.post(
  "/adjust",
  authorizePermissions("inventory:update"),
  stockController.adjust
);

router.get(
  "/item/:inventoryItemId",
  authorizePermissions("inventory:read"),
  stockController.getTransactions
);

router.get(
  "/restaurant/:restaurantId",
  authorizePermissions("inventory:read"),
  stockController.getRestaurantTransactions
);

export default router;