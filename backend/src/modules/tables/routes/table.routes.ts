import { Router } from "express";

import {
  authenticate,
  authorizePermissions,
} from "../../../middleware/auth";

import {
  validateRequest,
} from "../../../middleware/validation";

import {
  createTableSchema,
  updateTableSchema,
  updateTableStatusSchema,
  updateTableActiveStatusSchema,
} from "../validators/table.validator";

import {
  tableController,
} from "../controllers/table.controller";

const router = Router();

router.post(
  "/",
  authenticate,
  authorizePermissions("table:create"),
  validateRequest(createTableSchema),
  (req, res, next) =>
    tableController.create(
      req,
      res,
      next
    )
);

router.get(
  "/",
  authenticate,
  authorizePermissions("table:read"),
  (req, res, next) =>
    tableController.getAll(
      req,
      res,
      next
    )
);

router.get(
  "/branch/:branchId",
  authenticate,
  authorizePermissions("table:read"),
  (req, res, next) =>
    tableController.getByBranch(
      req,
      res,
      next
    )
);

router.get(
  "/floor/:floorId",
  authenticate,
  authorizePermissions("table:read"),
  (req, res, next) =>
    tableController.getByFloor(
      req,
      res,
      next
    )
);

router.get(
  "/:tableId",
  authenticate,
  authorizePermissions("table:read"),
  (req, res, next) =>
    tableController.getById(
      req,
      res,
      next
    )
);

router.patch(
  "/:tableId",
  authenticate,
  authorizePermissions("table:update"),
  validateRequest(updateTableSchema),
  (req, res, next) =>
    tableController.update(
      req,
      res,
      next
    )
);

router.patch(
  "/:tableId/status",
  authenticate,
  authorizePermissions("table:update"),
  validateRequest(updateTableStatusSchema),
  (req, res, next) =>
    tableController.updateStatus(
      req,
      res,
      next
    )
);

router.patch(
  "/:tableId/active-status",
  authenticate,
  authorizePermissions("table:update"),
  validateRequest(updateTableActiveStatusSchema),
  (req, res, next) =>
    tableController.updateActiveStatus(
      req,
      res,
      next
    )
);

router.delete(
  "/:tableId",
  authenticate,
  authorizePermissions("table:delete"),
  (req, res, next) =>
    tableController.delete(
      req,
      res,
      next
    )
);

export default router;