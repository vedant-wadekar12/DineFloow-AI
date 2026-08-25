import { Router } from "express";

import {
  authenticate,
  authorizePermissions,
} from "../../middleware/auth";

const router = Router();

router.get(
  "/order-create",
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