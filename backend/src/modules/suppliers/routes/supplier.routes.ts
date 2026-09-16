import { Router } from "express";
import { supplierController } from "../controllers/supplier.controller";
import {
  authenticate,
  authorizePermissions,
} from "../../../middleware/auth";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  authorizePermissions("supplier:create"),
  supplierController.create.bind(supplierController)
);

router.get(
  "/",
  authorizePermissions("supplier:read"),
  supplierController.getAll.bind(supplierController)
);

router.get(
  "/:supplierId",
  authorizePermissions("supplier:read"),
  supplierController.getById.bind(supplierController)
);

router.patch(
  "/:supplierId",
  authorizePermissions("supplier:update"),
  supplierController.update.bind(supplierController)
);

router.patch(
  "/:supplierId/status",
  authorizePermissions("supplier:update"),
  supplierController.updateStatus.bind(supplierController)
);

router.delete(
  "/:supplierId",
  authorizePermissions("supplier:delete"),
  supplierController.delete.bind(supplierController)
);

export default router;