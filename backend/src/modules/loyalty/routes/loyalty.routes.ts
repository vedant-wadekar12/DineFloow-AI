import { Router } from "express";

import {
  authenticate,
  authorizePermissions,
} from "../../../middleware/auth";

import {
  loyaltyController,
} from "../controllers/loyalty.controller";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  authorizePermissions("loyalty:create"),
  loyaltyController.createAccount
);

router.get(
  "/customer/:customerId",
  authorizePermissions("loyalty:read"),
  loyaltyController.getAccount
);

router.get(
  "/customer/:customerId/transactions",
  authorizePermissions("loyalty:read"),
  loyaltyController.transactions
);

router.post(
  "/earn",
  authorizePermissions("loyalty:update"),
  loyaltyController.earn
);

router.post(
  "/redeem",
  authorizePermissions("loyalty:update"),
  loyaltyController.redeem
);

router.post(
  "/adjust",
  authorizePermissions("loyalty:update"),
  loyaltyController.adjust
);

export default router;