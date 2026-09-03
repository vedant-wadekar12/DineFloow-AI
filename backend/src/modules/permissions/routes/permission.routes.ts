import { Router } from "express";

import {
  authenticate,
  authorizePermissions,
} from "../../../middleware/auth";

import {
  permissionController,
} from "../controllers/permission.controller";

const router = Router();

router.get(
  "/",
  authenticate,
  authorizePermissions("role:read"),
  (req, res, next) =>
    permissionController.getAll(req, res, next)
);

router.get(
  "/:permissionId",
  authenticate,
  authorizePermissions("role:read"),
  (req, res, next) =>
    permissionController.getById(req, res, next)
);

export default router;