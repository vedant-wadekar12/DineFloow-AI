# DineFlow AI — Seven Frontends

Production-oriented React + TypeScript + Vite + Tailwind frontend suite for DineFlow AI.

## Applications
- `dineflow-admin` — SUPER_ADMIN / platform administration
- `dineflow-owner` — RESTAURANT_OWNER
- `dineflow-manager` — BRANCH_MANAGER
- `dineflow-cashier` — CASHIER
- `dineflow-waiter` — WAITER
- `dineflow-chef` — CHEF / KITCHEN_STAFF
- `dineflow-customer` — customer ordering

## API environment
Each app contains `.env` with:

`VITE_API_BASE_URL=http://localhost:5000/api/v1`

`VITE_SOCKET_URL=http://localhost:5000`

Never add MongoDB credentials or an OpenAI secret key to these files.

## Verify an app
```powershell
npm install
npm run type-check
npm run lint
npm run build
npm run dev
```

## Preview routes
Every staff/platform app has `/preview` for UI navigation without pretending to be authenticated. Preview does not create fake backend records.

## Design references
See `DESIGN-QUALITY.md`.
