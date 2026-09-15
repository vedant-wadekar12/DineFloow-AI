import { Router } from "express";

import {
  authenticate,
  authorizePermissions,
} from "../../../middleware/auth";

import {
  menuComboController,
} from "../controllers/menu-combo.controller";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  authorizePermissions("menu:create"),
  menuComboController.create
);

router.get(
  "/restaurant/:restaurantId",
  authorizePermissions("menu:read"),
  menuComboController.getByRestaurant
);

router.get(
  "/:comboId",
  authorizePermissions("menu:read"),
  menuComboController.getById
);

router.patch(
  "/:comboId",
  authorizePermissions("menu:update"),
  menuComboController.update
);

router.patch(
  "/:comboId/availability",
  authorizePermissions("menu:update"),
  menuComboController.updateAvailability
);

router.delete(
  "/:comboId",
  authorizePermissions("menu:delete"),
  menuComboController.delete
);

export default router;