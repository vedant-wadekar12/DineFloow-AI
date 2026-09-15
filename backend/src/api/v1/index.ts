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

import categoryRoutes from "../../modules/categories/routes/category.routes";

import menuItemRoutes from "../../modules/menu/routes/menu-item.routes";

import qrRoutes from "../../modules/qr/routes/qr.routes";

import employeeRoutes from "../../modules/employees/routes/employee.routes";

import customerRoutes from "../../modules/customers/routes/customer.routes";

import menuVariantRoutes
  from "../../modules/menu/routes/menu-variant.routes";

import menuAddonRoutes
  from "../../modules/menu/routes/menu-addon.routes";

import menuComboRoutes
  from "../../modules/menu/routes/menu-combo.routes";


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

router.use("/customers", customerRoutes);

router.use(
  "/role-permissions",
  rolePermissionRoutes
);

router.use(
  "/menu-variants",
  menuVariantRoutes
);

router.use(
  "/menu-addons",
  menuAddonRoutes
);

router.use(
  "/menu-combos",
  menuComboRoutes
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

router.use("/qr", qrRoutes);

router.use(
  "/tables",
  tableRoutes
);

router.use("/employees", employeeRoutes);

router.use(
  "/categories",
  categoryRoutes
);

router.use(
  "/menu-items",
  menuItemRoutes
);

export default router;