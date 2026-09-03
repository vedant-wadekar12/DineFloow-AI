import { Router } from "express";

import {
  authenticate,
  authorizePermissions,
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

router.post(
  "/",
  authenticate,
  authorizePermissions("restaurant:create"),
  validateRequest(createRestaurantSchema),
  (req, res, next) =>
    restaurantController.create(req, res, next)
);

router.get(
  "/",
  authenticate,
  authorizePermissions("restaurant:read"),
  (req, res, next) =>
    restaurantController.getAll(req, res, next)
);

router.get(
  "/my",
  authenticate,
  authorizePermissions("restaurant:read"),
  (req, res, next) =>
    restaurantController.getMyRestaurants(
      req,
      res,
      next
    )
);

router.get(
  "/:restaurantId",
  authenticate,
  authorizePermissions("restaurant:read"),
  (req, res, next) =>
    restaurantController.getById(
      req,
      res,
      next
    )
);

router.patch(
  "/:restaurantId",
  authenticate,
  authorizePermissions("restaurant:update"),
  validateRequest(updateRestaurantSchema),
  (req, res, next) =>
    restaurantController.update(
      req,
      res,
      next
    )
);

router.patch(
  "/:restaurantId/status",
  authenticate,
  authorizePermissions("restaurant:update"),
  validateRequest(updateRestaurantStatusSchema),
  (req, res, next) =>
    restaurantController.updateStatus(
      req,
      res,
      next
    )
);

router.delete(
  "/:restaurantId",
  authenticate,
  authorizePermissions("restaurant:delete"),
  (req, res, next) =>
    restaurantController.delete(
      req,
      res,
      next
    )
);

export default router;