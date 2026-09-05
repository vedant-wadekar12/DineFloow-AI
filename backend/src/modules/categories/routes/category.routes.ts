import { Router } from "express";

import {
  authenticate,
  authorizePermissions,
} from "../../../middleware/auth";

import {
  validateRequest,
} from "../../../middleware/validation";

import {
  createCategorySchema,
  updateCategorySchema,
  updateCategoryStatusSchema,
} from "../validators/category.validator";

import {
  categoryController,
} from "../controllers/category.controller";

const router = Router();

router.post(
  "/",
  authenticate,
  authorizePermissions("menu:create"),
  validateRequest(createCategorySchema),
  (req, res, next) =>
    categoryController.create(
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
    categoryController.getAll(
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
    categoryController.getByRestaurant(
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
    categoryController.getByBranch(
      req,
      res,
      next
    )
);

router.get(
  "/:categoryId",
  authenticate,
  authorizePermissions("menu:read"),
  (req, res, next) =>
    categoryController.getById(
      req,
      res,
      next
    )
);

router.patch(
  "/:categoryId",
  authenticate,
  authorizePermissions("menu:update"),
  validateRequest(updateCategorySchema),
  (req, res, next) =>
    categoryController.update(
      req,
      res,
      next
    )
);

router.patch(
  "/:categoryId/status",
  authenticate,
  authorizePermissions("menu:update"),
  validateRequest(updateCategoryStatusSchema),
  (req, res, next) =>
    categoryController.updateStatus(
      req,
      res,
      next
    )
);

router.delete(
  "/:categoryId",
  authenticate,
  authorizePermissions("menu:delete"),
  (req, res, next) =>
    categoryController.delete(
      req,
      res,
      next
    )
);

export default router;