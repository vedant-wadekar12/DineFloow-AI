# DineFlow AI Frontend Development

## Requirements

- Node.js and npm installed.
- Existing DineFlow backend running on the configured API base URL.
- MongoDB remains backend-only.

## Per-application commands

```powershell
npm install
npm run type-check
npm run build
npm run dev
```

## Ports

- Admin: 5173
- Owner: 5174
- Manager: 5175
- Cashier: 5176
- Waiter: 5177
- Chef: 5178
- Customer: 5179

## Environment

Each application has both `.env.example` and a development `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```

Do not add MongoDB URIs, JWT secrets, bcrypt secrets or backend credentials to any frontend `.env` file.

## Troubleshooting login

1. Confirm the backend is actually listening on port `5000`.
2. Confirm the browser application loaded `VITE_API_BASE_URL` after restarting Vite.
3. Open browser DevTools → Network and inspect the login request.
4. A network failure means the browser cannot reach the configured backend.
5. A 401/403 means the backend rejected the credentials/account/authorization.
6. A 404 means the documented backend route and frontend route do not match; treat it as a backend API contract issue rather than inventing another route.

## Preview

The staff applications provide `/preview` routes for inspecting UI without granting authentication or backend permissions. Preview data is intentionally not presented as live production data.
