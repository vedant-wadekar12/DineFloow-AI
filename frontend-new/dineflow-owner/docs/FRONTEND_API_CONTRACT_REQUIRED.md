# DineFlow AI — Frontend API Contract Checklist

The frontend source supplied in the ZIP already contains API integrations for authentication, restaurants, branches, floors, tables, QR, menu, staff/employees, customers, inventory, suppliers, and orders.

The following modules now have complete frontend routes/UI shells but **must not invent backend behavior**. Before wiring them to live data, provide the documented endpoint/request/response/socket contracts:

- Kitchen
- Waiter
- Billing
- Payments
- Analytics
- Reports
- Notifications
- AI recommendations
- Settings
- Subscription
- Coupons
- Offers
- Loyalty
- Purchases
- Audit log
- Uploads
- Public customer menu/cart/checkout/order
- Socket.IO events and authentication

## Authentication contract inconsistency to confirm

The existing frontend contains both `/auth/refresh` in the Axios interceptor and `/auth/refresh-token` in the authentication service. The exact backend refresh endpoint and response shape must be confirmed before changing either one.

## Important

No backend source is required or used by the frontend implementation. Backend authorization remains authoritative.
