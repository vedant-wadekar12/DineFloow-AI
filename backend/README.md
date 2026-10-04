# DineFlow AI — Backend

A production-grade, multi-tenant restaurant management SaaS backend.

## Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 22 |
| Language | TypeScript 7 |
| Framework | Express 5 |
| Database | MongoDB Atlas / Mongoose 9 |
| Cache / Queues | Redis (IORedis) + BullMQ |
| Auth | JWT (access + refresh), bcrypt |
| RBAC | Role-based with permission constants |
| Real-time | Socket.IO 4 + Redis Adapter |
| Process Manager | PM2 (cluster mode, 4 instances) |
| Reverse Proxy | Nginx |
| Containerisation | Docker / Docker Compose |

---

## Local Development

### 1. Prerequisites

- Node.js 22+
- MongoDB (local or Atlas URI)
- Redis 7+ (optional — app fails gracefully when offline)

### 2. Install

```bash
npm install
```

### 3. Environment

```bash
cp .env.example .env
# Fill in your values
```

### 4. Dev server

```bash
npm run dev
```

### 5. Type check

```bash
npm run type-check
```

### 6. Tests

```bash
npm test
```

---

## Production Deployment

### Option A — PM2 Cluster (bare metal / VPS)

**1. Build**

```bash
npm run build
```

**2. Set environment**

```bash
cp .env.example .env
# Set NODE_ENV=production and all secrets
```

**3. Start PM2 cluster (4 workers)**

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup   # Enable auto-start on reboot
```

**4. Nginx**

Copy `nginx.conf.example` to `/etc/nginx/conf.d/dineflow.conf`, adjust `server_name`, then:

```bash
nginx -t && systemctl reload nginx
```

---

### Option B — Docker Compose

```bash
# Build and start (API + Redis)
docker compose up -d --build

# View logs
docker compose logs -f api
```

> MongoDB must be provided externally (e.g. MongoDB Atlas). Set `MONGODB_URI` in your `.env`.

---

## API Endpoints

### Health & Readiness

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/health` | None | Service health check |
| GET | `/api/v1/ready` | None | Readiness probe (DB + Redis) |

### Authentication

| Method | Path | Auth | Rate Limit |
|---|---|---|---|
| POST | `/api/v1/auth/register` | None | 15 req / 15 min per IP |
| POST | `/api/v1/auth/login` | None | 15 req / 15 min per IP |
| POST | `/api/v1/auth/logout` | None | — |

### Password Reset

| Method | Path | Auth | Rate Limit |
|---|---|---|---|
| POST | `/api/v1/password-resets/forgot-password` | None | 5 req / 60 min per IP |
| POST | `/api/v1/password-resets/reset-password` | None | — |

### Payments & Webhooks

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/payments/webhook/razorpay` | None (HMAC verified) | Razorpay webhook |
| POST | `/api/v1/payments/` | Bearer | Create payment |
| GET | `/api/v1/payments/` | Bearer | List payments |

All other routes require `Authorization: Bearer <access_token>`.

---

## Rate Limiting

All rate limits are distributed via Redis so they are consistent across all PM2 workers.

| Limiter | Limit | Window | Scope |
|---|---|---|---|
| Global API | 100 req | 15 min | Per tenant + IP |
| Auth (login/register) | 15 req | 15 min | Per IP |
| Password reset | 5 req | 60 min | Per IP |
| Webhook | 60 req | 1 min | Per IP |

When Redis is offline:
- **Auth / password reset** limiters fail-closed (503) in production.
- **Global API / webhook** limiters fail-open (request passes through).

---

## Multi-Tenancy

- Every authenticated request has `restaurantId` loaded from MongoDB (not the JWT).
- `AsyncLocalStorage` tenant context propagates through the entire request lifecycle.
- All Mongoose queries in protected modules are automatically scoped to `restaurantId`.
- IDOR between tenants is structurally impossible for authenticated endpoints.

---

## Socket.IO

- Authenticated via JWT on the WebSocket handshake.
- Rooms: `user:<userId>`, `restaurant:<restaurantId>`, `branch:<branchId>`.
- Redis Adapter enables cross-process event delivery across all PM2 workers.
- Falls back to local memory adapter if Redis is unavailable.

---

## Webhook Security

Razorpay webhooks are verified with HMAC-SHA256 (`x-razorpay-signature` header) using `RAZORPAY_WEBHOOK_SECRET`. Idempotency is enforced via a persistent `WebhookEvent` MongoDB collection with a unique `eventId` index.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NODE_ENV` | Yes | `development` or `production` |
| `PORT` | Yes | Server port (default `5000`) |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_ACCESS_SECRET` | Yes | Access token signing secret |
| `JWT_REFRESH_SECRET` | Yes | Refresh token signing secret |
| `JWT_ACCESS_EXPIRES_IN` | Yes | e.g. `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Yes | e.g. `7d` |
| `BCRYPT_SALT_ROUNDS` | Yes | e.g. `10` |
| `REDIS_URL` | No | Redis URL (rate limit, queues, Socket.IO) |
| `RAZORPAY_WEBHOOK_SECRET` | No | Webhook HMAC secret |
| `EMAIL_USER` | No | SMTP username |
| `EMAIL_PASS` | No | SMTP password |
| `CLIENT_URL` | No | Frontend URL for CORS |

---

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run type-check` | TypeScript type check (no emit) |
| `npm test` | Run Vitest test suite |
| `pm2 start ecosystem.config.js` | Start production cluster |
| `pm2 logs` | View live PM2 logs |
| `pm2 reload ecosystem.config.js` | Zero-downtime reload |

## Windows first-run checklist

From the `backend` folder:

```powershell
npm ci
Copy-Item .env.example .env
# Edit .env and provide your real MongoDB/JWT values.
# If you already have a working DineFlow .env, copy its values into this .env.
npm run migrate:tenant
npm run type-check
npm run build
npm test
npm run dev
```

Do not commit `.env`.
