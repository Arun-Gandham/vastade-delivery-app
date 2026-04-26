# Quick Commerce Backend

Production-oriented TypeScript/Express backend for a small-scale Zepto/Instamart-style grocery delivery platform. The implementation follows the provided blueprint and includes auth, profile, addresses, shops, categories, products, inventory, cart, orders, captains, notifications, uploads, dashboards, Prisma schema, Redis/BullMQ wiring, and Docker assets.

## Stack

- Node.js
- TypeScript
- Express
- Prisma
- MySQL
- Redis
- BullMQ
- Zod
- JWT

Example MySQL connection string:

```env
DATABASE_URL=mysql://root:password@localhost:3306/quick_commerce
```

Redis is optional. Enable it only when you want BullMQ-backed jobs:

```env
USE_REDIS=true
REDIS_URL=redis://localhost:6379
```

## Setup

```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev
npm run prisma:seed
npm run dev
```

API base URL:

```txt
http://localhost:5000/api/v1
```

Swagger:

```txt
http://localhost:5000/api-docs
```

## Main Modules

- `src/modules/auth`
- `src/modules/users`
- `src/modules/addresses`
- `src/modules/shops`
- `src/modules/categories`
- `src/modules/products`
- `src/modules/inventory`
- `src/modules/cart`
- `src/modules/orders`
- `src/modules/captains`
- `src/modules/notifications`
- `src/modules/uploads`
- `src/modules/dashboard`

Each module follows:

```txt
routes / controller / service / repository / validation / types
```

## Notable Behaviors

- JWT access and refresh token flow with persisted sessions.
- Transactional order placement, cancellation, captain delivery, and inventory adjustment.
- Soft delete behavior for core catalog entities through `isActive`.
- Authenticated presigned S3 upload flow for images, with direct client uploads and URL-only persistence.
- Admin and shop dashboard summary endpoints.
- Queue bootstrap for order notifications using BullMQ.
- Payment, coupon, captain assignment, and reporting API surfaces aligned with the backend docs.

## Seed Users

- Super admin: `9999999998` / `SuperAdmin@123`
- Admin: `9999999999` / `Admin@123`
- Shop owner: `8888888888` / `Admin@123`
- Customer: `7777777777` / `Customer@123`
- Captain: `6666666666` / `Captain@123`

If you want a guaranteed first-login platform account without reseeding, set `SUPER_ADMIN_MOBILE` and `SUPER_ADMIN_PASSWORD` in `.env`. The server will bootstrap or refresh that super admin on startup.

## Docker

```bash
docker compose up -d --build
```

## Test

```bash
npm test
```
