import { Router } from "express";

import { ApiResponse } from "../../common/responses";

import authRoutes from "../../modules/auth/routes/auth.routes";

import refreshTokenRoutes from "../../modules/refresh-tokens/routes/refresh-token.routes";

import protectedRoutes from "./protected.routes";

import authorizationTestRoutes from "./authorization-test.routes";

import userRoutes from "../../modules/users/routes/user.routes";

import passwordResetRoutes from "../../modules/password-resets/routes/password-reset.routes";

import rolePermissionRoutes from "../../modules/role-permissions/routes/role-permission.routes";

import permissionRoutes from "../../modules/permissions/routes/permission.routes";

import restaurantRoutes from "../../modules/restaurants/routes/restaurant.routes";

import branchRoutes from "../../modules/branches/routes/branch.routes";

import floorRoutes from "../../modules/floors/routes/floor.routes";

import tableRoutes from "../../modules/tables/routes/table.routes";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json(
    new ApiResponse(
      true,
      "DineFlow AI Backend is running",
      {
        timestamp: new Date().toISOString(),
      }
    )
  );
});

router.use("/auth", authRoutes);

router.use("/auth", refreshTokenRoutes);

router.use("/protected", protectedRoutes);

router.use("/authorization-test", authorizationTestRoutes);

router.use("/users", userRoutes);

router.use("/auth", passwordResetRoutes);

router.use(
  "/role-permissions",
  rolePermissionRoutes
);

router.use(
  "/permissions",
  permissionRoutes
);

router.use(
  "/restaurants",
  restaurantRoutes
);

router.use(
  "/branches",
  branchRoutes
);

router.use(
  "/floors",
  floorRoutes
);

router.use(
  "/tables",
  tableRoutes
);

export default router;