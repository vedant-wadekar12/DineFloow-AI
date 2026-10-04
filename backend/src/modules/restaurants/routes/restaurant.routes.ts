import { Router } from "express";

import {
  authenticate,
  authorizePermissions,
  requireActiveRestaurant,
  requireSuperAdmin,
} from "../../../middleware/auth";

import { validateRequest } from "../../../middleware/validation";

import {
  createRestaurantSchema,
  updateRestaurantSchema,
  updateRestaurantStatusSchema,
} from "../validators/restaurant.validator";

import {
  restaurantController,
} from "../controllers/restaurant.controller";

const router = Router();

/**
 * =========================================================
 * SUPER ADMIN ROUTES
 * =========================================================
 *
 * SUPER_ADMIN must be able to manage restaurants even when
 * those restaurants are inactive.
 */

router.get(
  "/admin/all",
  authenticate,
  requireSuperAdmin,
  (req, res, next) =>
    restaurantController.getAllAsSuperAdmin(
      req,
      res,
      next,
    ),
);

router.get(
  "/admin/:restaurantId",
  authenticate,
  requireSuperAdmin,
  (req, res, next) =>
    restaurantController.getByIdAsSuperAdmin(
      req,
      res,
      next,
    ),
);

router.patch(
  "/admin/:restaurantId/status",
  authenticate,
  requireSuperAdmin,
  validateRequest(updateRestaurantStatusSchema),
  (req, res, next) =>
    restaurantController.updateStatusAsSuperAdmin(
      req,
      res,
      next,
    ),
);

/**
 * =========================================================
 * OWNER / NORMAL RESTAURANT ROUTES
 * =========================================================
 */

/**
 * Restaurant creation is intentionally allowed without
 * requireActiveRestaurant because a user may not have a
 * restaurant yet.
 */
router.post(
  "/",
  authenticate,
  authorizePermissions("restaurant:create"),
  validateRequest(createRestaurantSchema),
  (req, res, next) =>
    restaurantController.create(
      req,
      res,
      next,
    ),
);

/**
 * Existing restaurant operations require the restaurant
 * account to be active.
 */

router.get(
  "/",
  authenticate,
  requireActiveRestaurant,
  authorizePermissions("restaurant:read"),
  (req, res, next) =>
    restaurantController.getAll(
      req,
      res,
      next,
    ),
);

router.get(
  "/my",
  authenticate,
  requireActiveRestaurant,
  authorizePermissions("restaurant:read"),
  (req, res, next) =>
    restaurantController.getMyRestaurants(
      req,
      res,
      next,
    ),
);

router.get(
  "/:restaurantId",
  authenticate,
  requireActiveRestaurant,
  authorizePermissions("restaurant:read"),
  (req, res, next) =>
    restaurantController.getById(
      req,
      res,
      next,
    ),
);

router.patch(
  "/:restaurantId",
  authenticate,
  requireActiveRestaurant,
  authorizePermissions("restaurant:update"),
  validateRequest(updateRestaurantSchema),
  (req, res, next) =>
    restaurantController.update(
      req,
      res,
      next,
    ),
);

router.patch(
  "/:restaurantId/status",
  authenticate,
  requireActiveRestaurant,
  authorizePermissions("restaurant:update"),
  validateRequest(updateRestaurantStatusSchema),
  (req, res, next) =>
    restaurantController.updateStatus(
      req,
      res,
      next,
    ),
);

router.delete(
  "/:restaurantId",
  authenticate,
  requireActiveRestaurant,
  authorizePermissions("restaurant:delete"),
  (req, res, next) =>
    restaurantController.delete(
      req,
      res,
      next,
    ),
);

export default router;