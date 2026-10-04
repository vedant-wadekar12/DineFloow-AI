# DineFlow AI Frontend

DineFlow AI is a React + TypeScript restaurant operations frontend with multi-tenant workspace navigation, authentication, permission-aware UI, restaurant management, menu, inventory, suppliers, orders, and public customer ordering surfaces.

## Run locally

```powershell
npm install
npm run dev
```

## Validate before presentation

```powershell
npm run type-check
npm run lint
npm run build
```

Create `.env` from `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

## Frontend boundaries

- Backend source is not included or modified by this project.
- Backend authorization remains authoritative.
- Axios is centralized in `src/services/api/api-client.ts`.
- Access-token refresh is coordinated so concurrent 401 responses do not create duplicate refresh requests.
- Restaurant selection is isolated in `RestaurantContext`.
- Protected application routes require authentication; documented permission-gated routes also enforce frontend visibility guards.
- The public customer entry point is `/r/:restaurantId/table/:tableNumber`.
- A global error boundary prevents an unexpected component error from producing a blank presentation screen.

## API contracts

Existing frontend services are preserved and used where their request/response shapes are already represented in the supplied project. For modules where no verified frontend contract was supplied, the project does not invent endpoints or response schemas. See:

`docs/FRONTEND_API_CONTRACT_REQUIRED.md`

Those boundaries are the only remaining integration dependency; they are not backend implementations.

## Real-data rule

Platform Admin production views do not contain hardcoded restaurant, payment, subscription, permission, or audit records. Restaurant account status uses the documented restaurant API. Subscription, Access & Permissions, and Audit surfaces remain explicitly contract-gated until their backend HTTP contracts are documented.
