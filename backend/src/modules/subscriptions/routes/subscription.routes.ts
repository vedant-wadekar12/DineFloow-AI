import { Router } from "express";

import {
  authenticate,
  authorizePermissions,
} from "../../../middleware/auth";

import {
  subscriptionController,
} from "../controllers/subscription.controller";

const router = Router();

router.use(authenticate);

router.post(
  "/plans",
  authorizePermissions("subscription:create"),
  subscriptionController.createPlan
);

router.get(
  "/plans",
  authorizePermissions("subscription:read"),
  subscriptionController.getPlans
);

router.get(
  "/plans/:planId",
  authorizePermissions("subscription:read"),
  subscriptionController.getPlan
);

router.post(
  "/",
  authorizePermissions("subscription:create"),
  subscriptionController.createSubscription
);

router.get(
  "/restaurant/:restaurantId",
  authorizePermissions("subscription:read"),
  subscriptionController.getSubscription
);

router.patch(
  "/restaurant/:restaurantId/plan",
  authorizePermissions("subscription:update"),
  subscriptionController.changePlan
);

router.post(
  "/restaurant/:restaurantId/cancel",
  authorizePermissions("subscription:update"),
  subscriptionController.cancel
);

router.post(
  "/restaurant/:restaurantId/renew",
  authorizePermissions("subscription:update"),
  subscriptionController.renew
);

router.get(
  "/restaurant/:restaurantId/status",
  authorizePermissions("subscription:read"),
  subscriptionController.checkStatus
);

export default router;