# DineFlow AI Frontend API Map

## Confirmed frontend contract currently wired

The existing frontend source contains integrations for:

- authentication
- restaurants
- branches
- floors
- tables
- QR
- menu/categories
- employees/staff
- customers
- inventory
- suppliers
- orders

Authentication paths currently wired by the frontend include `/auth/login`, `/auth/logout`, `/auth/refresh-token`, `/auth/me`, `/auth/forgot-password`, `/auth/reset-password`, and `/auth/verify-email`.

The exact backend response shape remains authoritative. The auth context accepts the documented response envelope variants already handled by the frontend and does not invent a new API.

## Contract required before live integration

The following must not be guessed:

- Kitchen
- Waiter
- Billing
- Payments
- Analytics
- Reports
- Notifications
- AI recommendations
- Settings mutations
- Subscription
- Coupons
- Offers
- Loyalty
- Purchases
- Audit log
- Uploads
- Public customer menu
- Customer cart
- Customer checkout
- Customer order tracking
- Customer payment
- Customer feedback
- Socket.IO connection/authentication/namespaces/rooms/events/payloads

When a contract is unavailable, the UI uses an explicit contract-required state instead of fake data.

## Contract issue format

```text
BACKEND API CONTRACT ISSUE

Frontend API contract required: [endpoint / request / response / socket event]
```

Do not invent endpoints, fields, permissions or Socket.IO events.
