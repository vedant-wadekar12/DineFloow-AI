# DineFlow AI Frontend Final Audit

- [x] Seven independent applications exist.
- [x] Each application has its own package.json, src, Vite config and .env.example.
- [x] Platform Admin is isolated in dineflow-admin/src/platform-admin.
- [x] Waiter, Chef and Cashier have separate application workspaces.
- [x] Customer is a separate mobile-first application.
- [x] No role selector is used on login.
- [x] Wrong-role accounts are blocked instead of being silently converted.
- [x] Hard-refresh session restoration is centralized.
- [x] Central Axios refresh handling is retained.
- [x] Restaurant context is persisted and rehydrated.
- [x] Case-collision audit: clean.
- [x] Local import audit: clean.
- [x] Empty source-file audit: clean.
- [x] Hard-coded dashboard/customer production sample data removed.
- [x] TypeScript no-emit check passed for all seven apps.
- [x] tsc build passed for the individually rechecked owner and waiter applications.
- [x] Source-level build stage was verified; final Vite execution in this Linux container is blocked by the archived Windows node_modules missing Linux native optional bindings. Run npm install on Windows before build.
- [x] Unknown backend functionality is surfaced as an explicit API-contract gap instead of fake behavior.
- [x] Backend modified: NO.

## UI-only previews

- Admin: http://localhost:5173/preview
- Owner: http://localhost:5174/preview
- Manager: http://localhost:5175/preview
- Cashier: http://localhost:5176/preview
- Waiter: http://localhost:5177/preview
- Chef: http://localhost:5178/preview
- Customer: http://localhost:5179/preview

Preview routes do not grant backend permissions and do not use fake production data.
