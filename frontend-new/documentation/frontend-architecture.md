# DineFlow AI Frontend Architecture

## Architecture

```text
Seven independent React applications
                |
                v
       Existing DineFlow backend
                |
                v
          MongoDB Atlas
```

The seven applications are independent deployments. They share the same backend API and do not access MongoDB directly.

## Applications

- `dineflow-admin`: platform administration, SUPER_ADMIN
- `dineflow-owner`: restaurant business management, RESTAURANT_OWNER
- `dineflow-manager`: branch operations, BRANCH_MANAGER
- `dineflow-cashier`: billing and payments, CASHIER
- `dineflow-waiter`: tables, orders and serving, WAITER
- `dineflow-chef`: kitchen operations, CHEF / KITCHEN_STAFF
- `dineflow-customer`: public customer ordering flow

## Shared frontend principles

- Central Axios client per application.
- Login uses email and password; no frontend role selector.
- Access and refresh tokens are handled only by the frontend authentication layer according to the existing frontend contract.
- A single in-flight refresh request is shared between concurrent 401 responses.
- Role guards are UX protection; backend authorization is the security boundary.
- Loading, empty, error, forbidden and unauthorized states are explicit.
- Destructive actions use confirmation UI where implemented.
- No frontend MongoDB access.
- No backend secrets in Vite environment variables.

## UI

Brand tokens are based on the supplied DineFlow design system:

- Primary: `#FF6B35`
- Secondary: `#FFB703`
- Dark: `#111827`
- Background: `#FFFDF8`
- Success: `#06D6A0`

The applications use React, TypeScript, Vite, Tailwind CSS v4, shadcn/Base UI components, Lucide icons, Axios and React Router.
