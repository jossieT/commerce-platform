# E-Commerce Platform

Full-stack production-grade e-commerce platform with Chapa payment integration.

## Stack

| Layer | Technology |
|---|---|
| Storefront | Next.js 14 (App Router) |
| Admin Dashboard | Next.js 14 (App Router) |
| Backend | NestJS 10 (modular monolith) |
| Primary DB | PostgreSQL 16 + TypeORM |
| Document DB | MongoDB 7 + Mongoose |
| Cache / Queue | Redis 7 + BullMQ |
| Payments | Chapa (Ethiopian payment gateway) |
| File Storage | Cloudinary / AWS S3 |
| Monorepo | Turborepo + npm workspaces |

## Project structure

```
ecommerce-platform/
├── apps/
│   ├── api/              # NestJS backend — port 4000
│   │   └── src/
│   │       ├── modules/  # auth, users, products, orders, payments, …
│   │       ├── config/   # app, db, jwt, chapa, storage configs
│   │       ├── common/   # guards, decorators, filters, interceptors
│   │       └── database/ # TypeORM migrations + seeders
│   ├── storefront/       # Customer-facing Next.js — port 3000
│   │   └── src/
│   │       ├── app/      # App Router pages
│   │       ├── components/
│   │       ├── lib/      # api client, utils
│   │       ├── hooks/    # TanStack Query hooks
│   │       └── store/    # Zustand (cart, auth)
│   └── admin/            # Admin dashboard Next.js — port 3001
│       └── src/
│           ├── app/      # dashboard, products, orders, customers, …
│           └── components/
├── packages/
│   ├── types/            # Shared TypeScript types (User, Product, Order, …)
│   └── config/           # Shared ESLint, TS, Tailwind configs
├── docker-compose.yml    # PostgreSQL + MongoDB + Redis
└── turbo.json
```

## Quick start

### 1. Clone and install

```bash
git clone <repo>
cd ecommerce-platform
npm install
```

### 2. Start databases

```bash
docker-compose up -d
```

### 3. Configure environment

```bash
cp apps/api/.env.example apps/api/.env
cp apps/storefront/.env.example apps/storefront/.env.local
cp apps/admin/.env.example apps/admin/.env.local
# Edit each file with your Chapa keys, DB passwords, etc.
```

### 4. Run all apps

```bash
npm run dev          # starts api:4000 + storefront:3000 + admin:3001
```

Or individually:
```bash
cd apps/api && npm run dev
cd apps/storefront && npm run dev
cd apps/admin && npm run dev
```

### 5. API docs

Visit `http://localhost:4000/api/docs` — Swagger UI, only in dev mode.

## Chapa integration

1. Sign up at [dashboard.chapa.co](https://dashboard.chapa.co) and get your test key.
2. Add `CHAPA_SECRET_KEY=CHASECK_TEST-xxx` to `apps/api/.env`.
3. For webhooks in development, use [ngrok](https://ngrok.com):

```bash
ngrok http 4000
# Set CHAPA_WEBHOOK_URL to https://<ngrok-id>.ngrok.io/api/v1/payments/webhook/chapa
# in your Chapa dashboard
```

## Build

```bash
npm run build        # builds all apps via Turborepo
```

## API module overview

| Module | Routes | Description |
|---|---|---|
| auth | POST /auth/register, /login, /refresh | JWT auth |
| users | GET/PUT /users/me, /me/addresses | Profile + addresses |
| products | CRUD /products, /categories | Catalog |
| orders | POST /orders, GET /orders/:id | Cart + checkout |
| payments | POST /payments/verify/:txRef, /webhook/chapa | Chapa payments |
| inventory | GET /inventory | Stock management |
| reviews | CRUD /reviews | Product reviews |
| coupons | CRUD /coupons | Discount codes |
| shipping | GET /shipping/zones | Shipping options |
| admin | GET /admin/stats | Dashboard data |
| uploads | POST /uploads/presign | File upload URLs |
