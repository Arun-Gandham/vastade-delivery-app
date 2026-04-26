# Quick Commerce Backend

TypeScript and Express backend for the Quick Commerce MVP. The backend exposes role-based APIs for auth, users, addresses, shops, categories, products, inventory, cart, orders, captains, notifications, uploads, and dashboards.

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

## Main modules

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

## S3 image flow

The backend now uses direct S3 uploads and does not keep uploaded image binaries on the API server.

Current contract:

1. Client calls authenticated `POST /uploads/image` with `filename`, `contentType`, and `folder`.
2. Backend validates the request and returns:
   - `uploadUrl`
   - `method`
   - `headers`
   - `key`
   - `imageUrl`
3. Client uploads directly to S3 using the signed request.
4. Client stores only the returned object key in catalog, profile, or delivery-proof payloads.
5. Read APIs resolve browser-safe image URLs before sending responses.

Response behavior:

- Categories and products expose `imageKey` and `imageUrl`
- User profile responses expose `profileImage` and `profileImageUrl`
- Private buckets return presigned `GET` URLs
- Public buckets return public HTTPS URLs based on `S3_PUBLIC_BASE_URL`

## Important environment variables

```env
DATABASE_URL=mysql://root:password@localhost:3306/quick_commerce
USE_REDIS=true
REDIS_URL=redis://localhost:6379
S3_ACCESS_KEY=
S3_SECRET_KEY=
S3_BUCKET=zepto-qa
S3_REGION=eu-north-1
S3_ENDPOINT=
S3_PUBLIC_BASE_URL=https://zepto-qa.s3.eu-north-1.amazonaws.com/qa
S3_KEY_PREFIX=qa
S3_UPLOAD_URL_EXPIRES_IN=300
S3_READ_URL_EXPIRES_IN=3600
S3_BUCKET_PUBLIC=false
```

## Notable behavior

- JWT access and refresh token flow with persisted sessions
- Transactional order placement, cancellation, captain delivery, and inventory adjustment
- Soft-delete behavior for catalog entities through `isActive`
- Customer-facing APIs that can be reused by the web frontend and future mobile apps
- Queue bootstrap for order notifications using BullMQ

## Seed users

- Super admin: `9999999998` / `SuperAdmin@123`
- Admin: `9999999999` / `Admin@123`
- Shop owner: `8888888888` / `Admin@123`
- Customer: `7777777777` / `Customer@123`
- Captain: `6666666666` / `Captain@123`

## Build and test

```bash
npm run build
npm test
```

## Docker

```bash
docker compose up -d --build
```
