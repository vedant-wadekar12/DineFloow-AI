import { Router } from "express";

import { cartController } from "../controllers/cart.controller";

const router = Router();

router.post(
  "/",
  cartController.create.bind(
    cartController
  )
);

router.get(
  "/:cartId",
  cartController.getById.bind(
    cartController
  )
);

router.post(
  "/:cartId/items",
  cartController.addItem.bind(
    cartController
  )
);

router.patch(
  "/:cartId/items/:itemId",
  cartController.updateItem.bind(
    cartController
  )
);

router.delete(
  "/:cartId/items/:itemId",
  cartController.removeItem.bind(
    cartController
  )
);

router.delete(
  "/:cartId/items",
  cartController.clear.bind(
    cartController
  )
);

router.post(
  "/:cartId/deactivate",
  cartController.deactivate.bind(
    cartController
  )
);

export default router;