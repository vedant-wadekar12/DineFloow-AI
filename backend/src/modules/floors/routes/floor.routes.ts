import { Router } from "express";

import {
  authenticate,
  authorizePermissions,
} from "../../../middleware/auth";

import {
  validateRequest,
} from "../../../middleware/validation";

import {
  createFloorSchema,
  updateFloorSchema,
  updateFloorStatusSchema,
} from "../validators/floor.validator";

import {
  floorController,
} from "../controllers/floor.controller";

const router = Router();

router.post(
  "/",
  authenticate,
  authorizePermissions("floor:create"),
  validateRequest(createFloorSchema),
  (req, res, next) =>
    floorController.create(req, res, next)
);

router.get(
  "/",
  authenticate,
  authorizePermissions("floor:read"),
  (req, res, next) =>
    floorController.getAll(req, res, next)
);

router.get(
  "/branch/:branchId",
  authenticate,
  authorizePermissions("floor:read"),
  (req, res, next) =>
    floorController.getByBranch(
      req,
      res,
      next
    )
);

router.get(
  "/:floorId",
  authenticate,
  authorizePermissions("floor:read"),
  (req, res, next) =>
    floorController.getById(
      req,
      res,
      next
    )
);

router.patch(
  "/:floorId",
  authenticate,
  authorizePermissions("floor:update"),
  validateRequest(updateFloorSchema),
  (req, res, next) =>
    floorController.update(
      req,
      res,
      next
    )
);

router.patch(
  "/:floorId/status",
  authenticate,
  authorizePermissions("floor:update"),
  validateRequest(updateFloorStatusSchema),
  (req, res, next) =>
    floorController.updateStatus(
      req,
      res,
      next
    )
);

router.delete(
  "/:floorId",
  authenticate,
  authorizePermissions("floor:delete"),
  (req, res, next) =>
    floorController.delete(
      req,
      res,
      next
    )
);

export default router;