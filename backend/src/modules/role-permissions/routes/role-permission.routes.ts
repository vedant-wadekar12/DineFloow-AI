import { Router } from "express";

import {
  authenticate,
  authorizePermissions,
} from "../../../middleware/auth";

import { validateRequest } from "../../../middleware/validation";

import {
  assignPermissionSchema,
} from "../validators/role-permission.validator";

import {
  rolePermissionController,
} from "../controllers/role-permission.controller";

const router = Router();

router.post(
  "/:roleId/permissions",
  authenticate,
  authorizePermissions("role:update"),
  validateRequest(assignPermissionSchema),
  (req, res, next) =>
    rolePermissionController.assignPermission(
      req,
      res,
      next
    )
);

router.get(
  "/:roleId/permissions",
  authenticate,
  authorizePermissions("role:read"),
  (req, res, next) =>
    rolePermissionController.getRolePermissions(
      req,
      res,
      next
    )
);

export default router;