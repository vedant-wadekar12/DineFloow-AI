import { Router } from "express";

import {
  waiterController,
} from "../controllers/waiter.controller";

import {
  authenticate,
  authorizePermissions,
} from "../../../middleware/auth";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  authorizePermissions("waiter:create"),
  waiterController.create.bind(
    waiterController
  )
);

router.get(
  "/",
  authorizePermissions("waiter:read"),
  waiterController.getAll.bind(
    waiterController
  )
);

router.get(
  "/:taskId",
  authorizePermissions("waiter:read"),
  waiterController.getById.bind(
    waiterController
  )
);

router.patch(
  "/:taskId/assign",
  authorizePermissions("waiter:update"),
  waiterController.assignWaiter.bind(
    waiterController
  )
);

router.patch(
  "/:taskId/accept",
  authorizePermissions("waiter:update"),
  waiterController.accept.bind(
    waiterController
  )
);

router.patch(
  "/:taskId/serve",
  authorizePermissions("waiter:update"),
  waiterController.startServing.bind(
    waiterController
  )
);

router.patch(
  "/:taskId/served",
  authorizePermissions("waiter:update"),
  waiterController.markServed.bind(
    waiterController
  )
);

router.patch(
  "/:taskId/complete",
  authorizePermissions("waiter:update"),
  waiterController.complete.bind(
    waiterController
  )
);

router.patch(
  "/:taskId/priority",
  authorizePermissions("waiter:update"),
  waiterController.updatePriority.bind(
    waiterController
  )
);

router.post(
  "/:taskId/cancel",
  authorizePermissions("waiter:update"),
  waiterController.cancel.bind(
    waiterController
  )
);

export default router;