# DineFlow Platform Admin — Ready State

## Security / routing behavior

- `/` redirects to `/login`.
- `/preview` and every `/preview/*` route require an authenticated session.
- Platform Admin routes require the backend-provided `SUPER_ADMIN` role.
- A RESTAURANT_OWNER, BRANCH_MANAGER, CASHIER, WAITER, CHEF, or KITCHEN_STAFF account is never allowed to see Platform Admin preview data.
- Unauthorized authenticated users are sent to `/unauthorized` instead of a protected dashboard, avoiding redirect loops.
- Login validates the authenticated user's role after the backend login/current-user calls. Non-SUPER_ADMIN sessions are cleared immediately.
- No frontend-only role is treated as authorization.

## Platform Admin preview routes

These routes are useful for inspecting the UI after signing in with a real backend-authorized SUPER_ADMIN account:

- `/preview`
- `/preview/accounts`
- `/preview/subscriptions`
- `/preview/access`
- `/preview/audit`

The preview pages are presentation surfaces. They do not create, update, delete, approve, suspend, or fake backend records.

## Production routes

- `/dashboard`
- `/platform-admin`
- `/platform-admin/accounts`
- `/platform-admin/subscriptions`
- `/platform-admin/access`
- `/audit`
- `/settings`

These routes are also protected by `SUPER_ADMIN` authorization and should only use documented backend contracts.

## Required environment

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```

No OpenAI secret or other private credential belongs in this frontend `.env`.

## Local verification

```powershell
npm install
npm run type-check
npm run lint
npm run build
npm run dev
```

Then open `http://localhost:5173/login`.

Do not use `/preview` as an unauthenticated demo URL. It is intentionally protected now.
