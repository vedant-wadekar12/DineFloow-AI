import { Router } from "express";

import {
  authenticate,
  authorizePermissions,
} from "../../../middleware/auth";

import {
  employeeController,
} from "../controllers/employee.controller";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  authorizePermissions("user:create"),
  employeeController.create
);

router.get(
  "/",
  authorizePermissions("user:read"),
  employeeController.getAll
);

router.get(
  "/restaurant/:restaurantId",
  authorizePermissions("user:read"),
  employeeController.getByRestaurant
);

router.get(
  "/branch/:branchId",
  authorizePermissions("user:read"),
  employeeController.getByBranch
);

router.get(
  "/:employeeId",
  authorizePermissions("user:read"),
  employeeController.getById
);

router.patch(
  "/:employeeId",
  authorizePermissions("user:update"),
  employeeController.update
);

router.patch(
  "/:employeeId/status",
  authorizePermissions("user:update"),
  employeeController.updateStatus
);

router.delete(
  "/:employeeId",
  authorizePermissions("user:delete"),
  employeeController.delete
);

export default router;