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

import inventoryItemRoutes
  from "../../modules/inventory/routes/inventory-item.routes";

import stockRoutes
  from "../../modules/inventory/routes/stock.routes";

import menuRecipeRoutes
  from "../../modules/inventory/routes/menu-recipe.routes";

import supplierRoutes from "../../modules/suppliers/routes/supplier.routes";
import purchaseRoutes from "../../modules/purchases/routes/purchase.routes";

import cartRoutes from "../../modules/carts/routes/cart.routes";

import orderRoutes from "../../modules/orders/routes/order.routes";

import kitchenRoutes from "../../modules/kitchen/routes/kitchen.routes";

import waiterRoutes from "../../modules/waiter/routes/waiter.routes";

import billingRoutes from "../../modules/billing/routes/billing.routes";

import paymentRoutes from "../../modules/payments/routes/payment.routes";

import couponRoutes from "../../modules/coupons/routes/coupon.routes";

import offerRoutes from "../../modules/offers/routes/offer.routes";

import loyaltyRoutes
  from "../../modules/loyalty/routes/loyalty.routes";

import subscriptionRoutes
  from "../../modules/subscriptions/routes/subscription.routes";

import notificationRoutes from "../../modules/notifications/routes/notification.routes";

import analyticsRoutes from "../../modules/analytics/routes/analytics.routes";

import dashboardRoutes from "../../modules/analytics/routes/dashboard.routes";



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

router.use("/suppliers", supplierRoutes);

router.use("/purchases", purchaseRoutes);

router.use("/carts", cartRoutes);

router.use("/orders", orderRoutes);

router.use("/billing", billingRoutes);

router.use("/payments", paymentRoutes);

router.use("/coupons", couponRoutes);

router.use("/offers", offerRoutes);

router.use("/notifications", notificationRoutes);

router.use("/analytics", analyticsRoutes);

router.use("/dashboard", dashboardRoutes);

router.use(
  "/loyalty",
  loyaltyRoutes
);

router.use(
  "/subscriptions",
  subscriptionRoutes
);

router.use(
  "/role-permissions",
  rolePermissionRoutes
);

router.use(
  "/inventory-items",
  inventoryItemRoutes
);

router.use(
  "/kitchen",
  kitchenRoutes
);

router.use(
  "/waiter",
  waiterRoutes
);

router.use(
  "/stock",
  stockRoutes
);

router.use(
  "/menu-recipes",
  menuRecipeRoutes
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