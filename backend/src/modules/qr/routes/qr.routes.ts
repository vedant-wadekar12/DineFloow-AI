import { Router } from "express";

import { authenticate } from "../../../middleware/auth";
import { authorizePermissions } from "../../../middleware/auth";

import { qrController } from "../controllers/qr.controller";

const router = Router();

/*
 * PUBLIC QR ROUTE
 *
 * Customer/device scans QR and resolves
 * the QR token.
 */
router.get(
  "/public/:token",
  qrController.getQRByToken
);

/*
 * PROTECTED MANAGEMENT ROUTES
 */

router.use(authenticate);

router.post(
  "/",
  authorizePermissions("menu:update"),
  qrController.createQR
);

router.get(
  "/",
  authorizePermissions("menu:read"),
  qrController.getAllQRs
);

router.get(
  "/restaurant/:restaurantId",
  authorizePermissions("menu:read"),
  qrController.getQRsByRestaurant
);

router.get(
  "/branch/:branchId",
  authorizePermissions("menu:read"),
  qrController.getQRsByBranch
);

router.get(
  "/table/:tableId",
  authorizePermissions("menu:read"),
  qrController.getQRByTableId
);

router.get(
  "/:qrId",
  authorizePermissions("menu:read"),
  qrController.getQRById
);

router.patch(
  "/table/:tableId/regenerate",
  authorizePermissions("menu:update"),
  qrController.regenerateQR
);

router.patch(
  "/:qrId/status",
  authorizePermissions("menu:update"),
  qrController.updateStatus
);

router.delete(
  "/:qrId",
  authorizePermissions("menu:delete"),
  qrController.deleteQR
);

export default router;