import { Router } from "express";

import {
  authenticate,
  authorizePermissions,
} from "../../../middleware/auth";

import { validateRequest } from "../../../middleware/validation";

import {
  createBranchSchema,
  updateBranchSchema,
  updateBranchStatusSchema,
  assignBranchManagerSchema,
} from "../validators/branch.validator";

import {
  branchController,
} from "../controllers/branch.controller";

const router = Router();

router.post(
  "/",
  authenticate,
  authorizePermissions("branch:create"),
  validateRequest(createBranchSchema),
  (req, res, next) =>
    branchController.create(req, res, next)
);

router.get(
  "/",
  authenticate,
  authorizePermissions("branch:read"),
  (req, res, next) =>
    branchController.getAll(req, res, next)
);

router.get(
  "/restaurant/:restaurantId",
  authenticate,
  authorizePermissions("branch:read"),
  (req, res, next) =>
    branchController.getByRestaurant(
      req,
      res,
      next
    )
);

router.get(
  "/:branchId",
  authenticate,
  authorizePermissions("branch:read"),
  (req, res, next) =>
    branchController.getById(
      req,
      res,
      next
    )
);

router.patch(
  "/:branchId",
  authenticate,
  authorizePermissions("branch:update"),
  validateRequest(updateBranchSchema),
  (req, res, next) =>
    branchController.update(
      req,
      res,
      next
    )
);

router.patch(
  "/:branchId/status",
  authenticate,
  authorizePermissions("branch:update"),
  validateRequest(updateBranchStatusSchema),
  (req, res, next) =>
    branchController.updateStatus(
      req,
      res,
      next
    )
);

router.patch(
  "/:branchId/manager",
  authenticate,
  authorizePermissions("branch:update"),
  validateRequest(assignBranchManagerSchema),
  (req, res, next) =>
    branchController.assignManager(
      req,
      res,
      next
    )
);

router.delete(
  "/:branchId",
  authenticate,
  authorizePermissions("branch:delete"),
  (req, res, next) =>
    branchController.delete(
      req,
      res,
      next
    )
);

export default router;