# DineFlow AI — Frontend Design & Quality Record

## Design references
- Figma production design system: https://www.figma.com/design/MF99KPR9ieATqtWtUfaqms/DineFlow-AI-Production-Frontend-Design-System
- Canva visual direction board: https://canva.link/op7swp7kxqt0fqi

## Product rules
- Seven independent frontends: Admin, Owner, Manager, Cashier, Waiter, Chef, Customer.
- Backend is locked and untouched.
- Frontends communicate through documented HTTP/Socket.IO contracts only.
- No MongoDB connection from frontend.
- No secrets or OpenAI API keys in Vite client environment variables.
- AI features must call an approved backend AI endpoint; an OpenAI Platform key must never be embedded in browser code.
- Preview routes contain no fake API data.

## Verification performed in this build environment
- TypeScript `npm run type-check`: PASS for all 7 applications.
- Full Vite production build: not claimable in this Linux sandbox because the archived dependency tree lacks the platform-specific Rolldown native binding and fresh npm installation timed out. On Windows, run `npm install` in each app before `npm run build` so npm resolves the correct native optional dependency.

## Required local verification
Run `npm install`, `npm run type-check`, `npm run build`, and `npm run lint` in each app before deployment.
