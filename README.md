# Quick Commerce

Quick Commerce is a full-stack grocery ordering MVP with a Next.js frontend, an Express and Prisma backend, and a shared product contract designed for web and future mobile clients.

## What is in this repo

- `frontend/`: Next.js customer, captain, shop-owner, admin, and super-admin app
- `backend/`: Express API, Prisma schema, auth, catalog, orders, generic delivery tasks, parcels, uploads, and dashboards
- `docs/`: current product, backend, and frontend implementation reference

## Current implementation highlights

- Public landing page with a Zepto-style storefront header, browser location label, search bar, category grid, product sections, and storefront footer
- Customer storefront with a shared full-width header, compact footer, location prompt, nearby shops, category sections, product sections, and recent orders
- Role-based dashboards and protected routes for customer, captain, shop owner, admin, and super admin
- Shared enterprise UI chrome for dashboard roles through common sidebar, topbar, and floating mobile nav components
- Shared route-level dashboard layouts for admin and super-admin so sidebar and topbar persist while only page content changes
- Admin and super-admin management sections now favor list-only screens with dedicated create and edit pages for categories, shops, products, and coupons
- Captain onboarding is modeled as self-registration plus admin verification
- Delivery orchestration now runs through generic `delivery_tasks` for grocery, parcel, and future logistics services
- Direct-to-S3 image upload flow with backend-issued presigned `PUT` URLs
- S3 object key storage in the database with resolved browser-safe `imageUrl` values in API responses
- Support for both public buckets and private buckets with signed read URLs

## Captain and logistics architecture

Important business rules:

- captains are not created by admin or shop users
- captains register from a public registration flow or a future dedicated captain web or mobile app
- admin can review, approve, reject, block, unblock, and audit captains
- shop users can only view assigned delivery context for their own orders
- customer and shop tracking should read from `delivery_tasks`, not direct captain-order coupling

Dispatch model:

```txt
Grocery Order ─┐
Parcel Order  ─┼── Delivery Task ─── Captain
Future Orders ─┘
```

Recommended client split over time:

```txt
/backend
/customer-web
/shop-admin-web
/captain-web or mobile captain app
```

The repo currently keeps one Next.js frontend, but the backend APIs and docs are now designed so a dedicated captain client can be separated later without changing the delivery contract.

## Image handling contract

The application does not store uploaded images on the frontend server or backend server.

Current flow:

1. Frontend requests an authenticated upload signature from `POST /uploads/image`.
2. Backend validates the upload intent and returns `uploadUrl`, `key`, `imageUrl`, and request metadata.
3. Frontend uploads the file directly to S3.
4. Forms submit only the returned object key to profile, category, product, or delivery-proof APIs.
5. Read APIs return both the stored key and a browser-safe URL for rendering.

Examples:

- Category and product APIs return `imageKey` and `imageUrl`
- Profile APIs keep `profileImage` as the stored key and return `profileImageUrl` for display

If `S3_BUCKET_PUBLIC=true`, read APIs return public HTTPS URLs built from `S3_PUBLIC_BASE_URL`.

If `S3_BUCKET_PUBLIC=false`, read APIs return presigned `GET` URLs with inline content disposition.

## Backend setup

```bash
cd backend
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev
npm run prisma:seed
npm run dev
```

Backend API:

```txt
http://localhost:5000/api/v1
```

Swagger:

```txt
http://localhost:5000/api-docs
```

## Frontend setup

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Frontend app:

```txt
http://localhost:3000
```

## Required S3 backend environment

Set these in `backend/.env`:

```env
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

Notes:

- Use the AWS region code only, for example `eu-north-1`
- `S3_PUBLIC_BASE_URL` must be an HTTPS URL, not an `s3://` URI
- Keep access keys only on the backend

## Suggested S3 CORS

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "HEAD"],
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://yourdomain.com"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

## Verification

Backend:

```bash
cd backend
npm run build
```

Frontend:

```bash
cd frontend
npm run build
```

## Docs

Start here:

- [docs/README.md](./docs/README.md)
- [backend/README.md](./backend/README.md)
- [frontend/README.md](./frontend/README.md)
