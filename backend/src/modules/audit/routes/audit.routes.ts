import { Router } from "express";

import {
  authenticate,
} from "../../../middleware/auth/authenticate";

import {
  authorizePermissions,
} from "../../../middleware/auth/authorize-permission";

import {
  AuditController,
} from "../controllers/audit.controller";

const router = Router();

const controller =
  new AuditController();

router.use(authenticate);

router.get(
  "/",
  authorizePermissions(
    "audit:read"
  ),
  controller.getAudits
);

router.get(
  "/:auditId",
  authorizePermissions(
    "audit:read"
  ),
  controller.getAudit
);

export default router;