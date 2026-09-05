import { Router } from "express";

import {
  authenticate,
  authorizePermissions,
} from "../../../middleware/auth";

import {
  validateRequest,
} from "../../../middleware/validation";

import {
  createMenuItemSchema,
  updateMenuItemSchema,
  updateMenuItemAvailabilitySchema,
  updateMenuItemStatusSchema,
} from "../validators/menu-item.validator";

import {
  menuItemController,
} from "../controllers/menu-item.controller";

const router = Router();

router.post(
  "/",
  authenticate,
  authorizePermissions("menu:create"),
  validateRequest(createMenuItemSchema),
  (req, res, next) =>
    menuItemController.create(
      req,
      res,
      next
    )
);

router.get(
  "/",
  authenticate,
  authorizePermissions("menu:read"),
  (req, res, next) =>
    menuItemController.getAll(
      req,
      res,
      next
    )
);

router.get(
  "/restaurant/:restaurantId",
  authenticate,
  authorizePermissions("menu:read"),
  (req, res, next) =>
    menuItemController.getByRestaurant(
      req,
      res,
      next
    )
);

router.get(
  "/branch/:branchId",
  authenticate,
  authorizePermissions("menu:read"),
  (req, res, next) =>
    menuItemController.getByBranch(
      req,
      res,
      next
    )
);

router.get(
  "/category/:categoryId",
  authenticate,
  authorizePermissions("menu:read"),
  (req, res, next) =>
    menuItemController.getByCategory(
      req,
      res,
      next
    )
);

router.get(
  "/:itemId",
  authenticate,
  authorizePermissions("menu:read"),
  (req, res, next) =>
    menuItemController.getById(
      req,
      res,
      next
    )
);

router.patch(
  "/:itemId",
  authenticate,
  authorizePermissions("menu:update"),
  validateRequest(updateMenuItemSchema),
  (req, res, next) =>
    menuItemController.update(
      req,
      res,
      next
    )
);

router.patch(
  "/:itemId/availability",
  authenticate,
  authorizePermissions("menu:update"),
  validateRequest(
    updateMenuItemAvailabilitySchema
  ),
  (req, res, next) =>
    menuItemController.updateAvailability(
      req,
      res,
      next
    )
);

router.patch(
  "/:itemId/status",
  authenticate,
  authorizePermissions("menu:update"),
  validateRequest(
    updateMenuItemStatusSchema
  ),
  (req, res, next) =>
    menuItemController.updateStatus(
      req,
      res,
      next
    )
);

router.delete(
  "/:itemId",
  authenticate,
  authorizePermissions("menu:delete"),
  (req, res, next) =>
    menuItemController.delete(
      req,
      res,
      next
    )
);

export default router;