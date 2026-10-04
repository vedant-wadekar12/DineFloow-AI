# DineFlow AI Backend - Final Hardening Pass

This pass addresses additional high-risk issues found by static review of the final backend base.

## Fixed

1. **User management tenant isolation**
   - User list/read/status/role/delete operations are now restaurant-scoped for normal users.
   - SUPER_ADMIN remains platform-wide.
   - Non-super-admin users cannot assign the SUPER_ADMIN role.

2. **Global role-permission administration**
   - Assigning permissions to a role is now SUPER_ADMIN-only.
   - Normal restaurant users cannot modify global RBAC definitions even if a broad permission was previously seeded for them.

3. **Global subscription-plan administration**
   - Creating subscription plans is now SUPER_ADMIN-only.
   - Restaurant subscription create/read/update operations remain tenant-scoped.

4. **Employee cross-tenant user linking**
   - Employee creation now verifies the requested restaurant matches the authenticated tenant and the linked user belongs to that same restaurant.

5. **Kitchen chef assignment**
   - Chef assignment now requires the user to belong to the same restaurant as the kitchen ticket and to have the CHEF role.

6. **Waiter assignment**
   - Waiter assignment now requires the user to belong to the same restaurant as the waiter task and to have the WAITER role.

7. **Public cart IDOR protection**
   - Cart mutation/read/deactivation endpoints require `x-cart-session-id`.
   - Cart session IDs must be UUIDs when creating a cart.
   - Cart operations are scoped by both cart ID and session ID.
   - Cart creation validates restaurant, branch, table and customer relationships.
   - Menu item/variant/addon additions are checked against the cart restaurant.

8. **Public order protection**
   - Public order creation requires the cart session ID.
   - The order must match the cart restaurant/branch/table/customer context.
   - Order snapshots only load menu entities from the cart restaurant.
   - Orders retain the cart session ID so public cancellation can be authenticated with the same session credential.
   - Public order cancellation requires the same `x-cart-session-id`.

9. **Error stability**
   - MongoDB cast errors return HTTP 400 instead of HTTP 500.
   - MongoDB duplicate-key errors return HTTP 409.

10. **Super-admin middleware**
    - Added reusable `requireSuperAdmin` middleware.

11. **Current role name on request user**
    - Authentication now exposes the current database role name on `req.user.roleName`.

## Frontend contract change

For customer cart/order flows, generate one cryptographically random UUID session ID per customer/table session and send it on every cart request and every public order create/cancel request:

`x-cart-session-id: <same UUID>`

Do not use a predictable timestamp or restaurant ID as this value.

## Verification note

The archive intentionally excludes `node_modules` and `dist`. Run `npm ci` on the development machine before type-check/build/test. Live API and cross-tenant tests against MongoDB/Redis/Razorpay remain required before production deployment.

## Post-release fixes (2026-09-27)

The first Windows validation of the hardened archive exposed four packaging/source defects. They have been corrected in this archive:

1. Restored the complete `src/modules/uploads` module that was missing from the hardened ZIP while its route was still registered.
2. Added tenant isolation to the Upload model and stopped trusting client-supplied restaurant/branch IDs for upload ownership.
3. Fixed `OrderService.updateStatus()` to accept and validate the public cart session ID used by the controller.
4. Added `.env.example` and aligned environment defaults/optional email settings with the documented local-development setup.
5. Removed the deprecated `@types/winston` stub dependency.

The archive intentionally does not contain a real `.env` or `node_modules`.
