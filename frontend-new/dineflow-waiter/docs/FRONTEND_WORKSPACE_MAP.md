# DineFlow AI frontend workspace map

The frontend is one React application with separate role-specific workspaces.

## Platform Admin
- `/platform-admin` — SUPER_ADMIN operational control plane
- `/platform-admin/accounts` — activate, deactivate, or suspend/hold restaurant accounts using the documented restaurant status API
- `/platform-admin/subscriptions` — dedicated payment/subscription surface; intentionally waits for the documented backend contract
- `/platform-admin/access` — dedicated permission-control surface; intentionally waits for the documented permission mutation contract
- `/platform-admin/preview` — UI-only preview for presentation when the logged-in account is not SUPER_ADMIN; it does not grant backend permissions

## Restaurant operator
- `/dashboard` — role router
- `/workspace` — restaurant owner / branch manager dashboard
- `/restaurants`
- `/branches`
- `/floors`
- `/tables`
- `/qr`
- `/menu`
- `/staff`
- `/employees`
- `/customers`
- `/inventory`
- `/suppliers`
- `/purchases`
- `/orders`
- `/analytics`
- `/reports`
- `/ai`
- `/settings`

## Staff workspaces
- `/chef` — CHEF / KITCHEN_STAFF interface
- `/waiter` — WAITER interface
- `/cashier` — CASHIER interface
- `/staff-workspace` — generic staff operational shell for staff accounts

## Authentication persistence
The frontend restores the cached session on browser reload, refreshes an expired access token when a refresh token exists, and rehydrates `/auth/me` so role and permission information survives a hard refresh.

If `/auth/me` does not provide `role` or `roles`, the frontend does not guess the user's role. `/dashboard` shows a clear role-unavailable screen and provides a UI-only platform-admin preview.

## Backend contract boundary
Frontend role checks are UI visibility/routing hints only. Backend authorization remains authoritative.

For subscription/payment holds and arbitrary permission grants, the frontend does not invent endpoints. The UI explicitly identifies the missing contract.
