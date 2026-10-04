# Platform Admin — Real Data Boundary

This admin frontend contains no fabricated production data.

## Live and implemented

### Restaurant accounts
- `GET /restaurants`
- `PATCH /restaurants/:id/status`
- Supported frontend statuses: `ACTIVE`, `INACTIVE`, `SUSPENDED`

The account-control screen uses the authenticated backend response and sends the real status mutation. `SUSPENDED` is presented as **Decline / Suspend access**.

Important: the backend must enforce that a suspended restaurant cannot authenticate or use protected restaurant APIs. The frontend cannot create that security rule itself.

## Backend contract required

### Subscription Review
Required before displaying or mutating real subscription/payment records:
- list endpoint
- response shape
- pagination/filter parameters
- payment review/approval endpoint if supported
- payment decline endpoint if supported
- restaurant payment-hold/suspension endpoint if separate
- required SUPER_ADMIN permission(s)
- error responses

### Access & Permissions
Required before implementing real platform permission administration:
- platform user/account list endpoint
- role list endpoint
- permission list endpoint
- role/permission assignment endpoint
- revoke endpoint
- request bodies and response shapes
- required SUPER_ADMIN permission(s)

### Audit & Controls
Required before displaying real audit events:
- audit log endpoint
- pagination
- search/filter parameters
- event response shape
- actor/resource fields
- required SUPER_ADMIN permission(s)

Do not invent any of these contracts.
