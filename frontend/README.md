# Quick Commerce Frontend

Next.js frontend for the Quick Commerce MVP. The app includes a branded customer storefront and role-based areas for customer, captain, shop owner, admin, and super admin users.

## Tech stack

- Next.js
- TypeScript
- Tailwind CSS
- TanStack Query
- Zustand
- react-hook-form
- zod
- axios

## Main structure

- `src/app`: route tree and layouts
- `src/components`: reusable UI and storefront components
- `src/config`: app, API, and theme configuration
- `src/features`: typed APIs, hooks, and validation
- `src/store`: shared UI state
- `src/lib`: utilities and API client

## Customer storefront

The current customer experience includes:

- shared full-width storefront header
- shared compact storefront footer
- location prompt when no saved delivery context exists
- nearby shop discovery
- category sections
- product sections based on the active nearby shop
- recent order section
- login and logout affordances in the storefront header

The storefront now guards against stale persisted state by falling back to the first valid nearby shop when the previous selection is no longer valid.
The same `CustomerAppShell` is reused across all customer pages so the customer-facing frame stays consistent.

## Public landing page

The public `/` route now behaves like a storefront instead of a plain marketing page.

It includes:

- a Zepto-style header
- browser-based location label in the header
- storefront search bar
- catalog-driven category tiles
- catalog-driven product sections
- storefront footer with links and category shortcuts

## Shared role UI

The project now uses a more unified shared UI layer across role surfaces:

- refined public and customer storefront headers
- compact shared customer footer
- enterprise-style dashboard sidebar and topbar for admin, shop-owner, and super-admin flows
- polished floating mobile bottom navigation for customer and captain flows

The current visual baseline follows the newer public-page design language:

- stronger heading hierarchy
- cleaner compact header proportions
- wide soft search inputs
- lighter compact footer treatment
- calmer enterprise dashboard chrome

Admin and super-admin now use route-level shared dashboard layouts, so menu changes keep the same sidebar and topbar mounted while only the page content swaps.
Management screens now follow a cleaner pattern where list pages stay focused on table or card browsing, while create and edit flows open on separate routes.

## Captain product direction

Captain onboarding no longer belongs to admin or shop management flows.

Current rules:

- captains self-register
- admins verify and review captains
- shops do not create or approve captains
- captain delivery work is modeled around generic delivery tasks, not only grocery orders

The current Next.js app can still host captain pages, but the backend API contract is intentionally prepared for a later split into a dedicated `captain-web` or mobile captain app.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Default app URL:

```txt
http://localhost:3000
```

## Required environment variables

```env
NEXT_PUBLIC_APP_NAME=Quick Commerce
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_DEFAULT_LATITUDE=
NEXT_PUBLIC_DEFAULT_LONGITUDE=
NEXT_PUBLIC_SUPPORT_PHONE=
NEXT_PUBLIC_SUPPORT_EMAIL=
```

## Image uploads

Image uploads use a direct-to-S3 flow.

Behavior:

1. Frontend requests an authenticated upload signature from the backend.
2. Selected files upload directly from the browser to S3.
3. Form state stores only the returned object key.
4. UI previews use the returned or resolved browser-safe `imageUrl`.

This keeps the Next.js app out of the file-storage path and matches the backend contract needed for future mobile clients.

## Verification

```bash
npm run build
npm test
```
