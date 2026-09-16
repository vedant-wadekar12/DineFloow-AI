import { Router } from "express";

import {
  authenticate,
  authorizePermissions,
} from "../../../middleware/auth";

import {
  menuRecipeController,
} from "../controllers/menu-recipe.controller";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  authorizePermissions("inventory:create"),
  menuRecipeController.create
);

router.get(
  "/menu-item/:menuItemId",
  authorizePermissions("inventory:read"),
  menuRecipeController.getByMenuItem
);

router.patch(
  "/:recipeId",
  authorizePermissions("inventory:update"),
  menuRecipeController.update
);

router.delete(
  "/:recipeId",
  authorizePermissions("inventory:delete"),
  menuRecipeController.delete
);

export default router;