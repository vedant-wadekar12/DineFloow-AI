import { Router } from "express";

import {
  authenticate,
  authorizePermissions,
} from "../../middleware/auth";

const router = Router();

/**
 * Protected test route
 *
 * Requires:
 * 1. Valid access token
 * 2. order:create permission
 */
router.get(
  "/permission-test",
  authenticate,
  authorizePermissions("order:create"),
  (_req, res) => {
    return res.status(200).json({
      success: true,
      message: "Permission authorized successfully.",
    });
  }
);

export default router;