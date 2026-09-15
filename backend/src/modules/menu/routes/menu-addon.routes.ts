import { Router } from "express";

import {
  authenticate,
  authorizePermissions,
} from "../../../middleware/auth";

import {
  menuAddonController,
} from "../controllers/menu-addon.controller";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  authorizePermissions("menu:create"),
  menuAddonController.create
);

router.get(
  "/restaurant/:restaurantId",
  authorizePermissions("menu:read"),
  menuAddonController.getByRestaurant
);

router.get(
  "/:addonId",
  authorizePermissions("menu:read"),
  menuAddonController.getById
);

router.patch(
  "/:addonId",
  authorizePermissions("menu:update"),
  menuAddonController.update
);

router.patch(
  "/:addonId/availability",
  authorizePermissions("menu:update"),
  menuAddonController.updateAvailability
);

router.delete(
  "/:addonId",
  authorizePermissions("menu:delete"),
  menuAddonController.delete
);

export default router;