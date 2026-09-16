import { Router } from "express";

import { kitchenController } from "../controllers/kitchen.controller";

import {
  authenticate,
  authorizePermissions,
} from "../../../middleware/auth";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  authorizePermissions("kitchen:create"),
  kitchenController.create.bind(
    kitchenController
  )
);

router.get(
  "/",
  authorizePermissions("kitchen:read"),
  kitchenController.getAll.bind(
    kitchenController
  )
);

router.get(
  "/:ticketId",
  authorizePermissions("kitchen:read"),
  kitchenController.getById.bind(
    kitchenController
  )
);

router.patch(
  "/:ticketId/assign",
  authorizePermissions("kitchen:update"),
  kitchenController.assignChef.bind(
    kitchenController
  )
);

router.patch(
  "/:ticketId/accept",
  authorizePermissions("kitchen:update"),
  kitchenController.accept.bind(
    kitchenController
  )
);

router.patch(
  "/:ticketId/prepare",
  authorizePermissions("kitchen:update"),
  kitchenController.startPreparing.bind(
    kitchenController
  )
);

router.patch(
  "/:ticketId/ready",
  authorizePermissions("kitchen:update"),
  kitchenController.markReady.bind(
    kitchenController
  )
);

router.patch(
  "/:ticketId/priority",
  authorizePermissions("kitchen:update"),
  kitchenController.updatePriority.bind(
    kitchenController
  )
);

router.post(
  "/:ticketId/cancel",
  authorizePermissions("kitchen:update"),
  kitchenController.cancel.bind(
    kitchenController
  )
);

export default router;