import { Router } from "express";

import {
  authenticate,
  authorizePermissions,
} from "../../../middleware/auth";

import {
  menuVariantController,
} from "../controllers/menu-variant.controller";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  authorizePermissions("menu:create"),
  menuVariantController.create
);

router.get(
  "/menu-item/:menuItemId",
  authorizePermissions("menu:read"),
  menuVariantController.getByMenuItem
);

router.get(
  "/:variantId",
  authorizePermissions("menu:read"),
  menuVariantController.getById
);

router.patch(
  "/:variantId",
  authorizePermissions("menu:update"),
  menuVariantController.update
);

router.patch(
  "/:variantId/availability",
  authorizePermissions("menu:update"),
  menuVariantController.updateAvailability
);

router.delete(
  "/:variantId",
  authorizePermissions("menu:delete"),
  menuVariantController.delete
);

export default router;