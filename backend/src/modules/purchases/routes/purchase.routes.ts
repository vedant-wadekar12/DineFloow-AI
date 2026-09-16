import { Router } from "express";

import { purchaseController } from "../controllers/purchase.controller";
import {
  authenticate,
  authorizePermissions,
} from "../../../middleware/auth";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  authorizePermissions("purchase:create"),
  purchaseController.create.bind(
    purchaseController
  )
);

router.get(
  "/",
  authorizePermissions("purchase:read"),
  purchaseController.getAll.bind(
    purchaseController
  )
);

router.get(
  "/:purchaseId",
  authorizePermissions("purchase:read"),
  purchaseController.getById.bind(
    purchaseController
  )
);

router.patch(
  "/:purchaseId",
  authorizePermissions("purchase:update"),
  purchaseController.update.bind(
    purchaseController
  )
);

router.patch(
  "/:purchaseId/status",
  authorizePermissions("purchase:update"),
  purchaseController.updateStatus.bind(
    purchaseController
  )
);

router.post(
  "/:purchaseId/receive",
  authorizePermissions("purchase:receive"),
  purchaseController.receive.bind(
    purchaseController
  )
);

export default router;