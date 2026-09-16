import { Router } from "express";

import { orderController } from "../controllers/order.controller";

import {
  authenticate,
  authorizePermissions,
} from "../../../middleware/auth";

const router = Router();

router.get(
  "/",
  authenticate,
  authorizePermissions("order:read"),
  orderController.getAll.bind(
    orderController
  )
);

router.get(
  "/:orderId",
  authenticate,
  authorizePermissions("order:read"),
  orderController.getById.bind(
    orderController
  )
);

router.post(
  "/",
  orderController.create.bind(
    orderController
  )
);

router.patch(
  "/:orderId/status",
  authenticate,
  authorizePermissions("order:update"),
  orderController.updateStatus.bind(
    orderController
  )
);

router.post(
  "/:orderId/cancel",
  orderController.cancel.bind(
    orderController
  )
);

export default router;