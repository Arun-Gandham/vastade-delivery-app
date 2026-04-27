# Changelog

## 2026-04-26 - Indtula pilot test changes

### Type
Full-stack

### Status
Implemented

### Summary
Pilot test changes for the Indtula workflow were completed across the order flow and supporting frontend screens.

### Updated docs
- docs/product/03-user-flows.md
- docs/product/04-api-contracts.md
- docs/product/05-business-rules-statuses.md
- docs/backend/03-backend-architecture-standards.md
- docs/backend/05-transactions-testing-swagger-deployment.md

### Files changed
- backend/src/modules/orders/order.repository.ts
- backend/src/modules/orders/order.service.ts
- backend/src/modules/orders/order.controller.ts
- backend/src/modules/orders/order.validation.ts
- frontend/src/features/orders/IndtulaPilotTest.tsx
- frontend/src/features/orders/orders.api.ts
- frontend/src/app/orders/[orderId]/page.tsx

### Verification
- Pilot test workflow executes as expected.
- Backend and frontend builds succeeded.

## 2026-04-26 - S3 image storage rollout

### Type
Full-stack

### Status
Implemented

### Summary
Image handling was moved off the backend and frontend servers to direct S3 uploads. The backend now signs uploads, persists only S3 object keys, and resolves browser-safe `imageUrl` values on read. The same API contract can be reused by web and mobile clients.

### Updated docs
- docs/backend/04-infrastructure-security-env.md
- docs/frontend/05-api-integration.md
- docs/frontend/06-state-forms-validation.md
- docs/frontend/CHANGELOG.md
- backend/README.md
- frontend/README.md

### Files changed
- backend/src/config/env.ts
- backend/src/config/s3.ts
- backend/src/core/utils/s3-assets.ts
- backend/src/modules/uploads/upload.routes.ts
- backend/src/modules/uploads/upload.service.ts
- backend/src/modules/uploads/upload.validation.ts
- backend/src/modules/categories/category.service.ts
- backend/src/modules/products/product.service.ts
- backend/src/modules/users/user.service.ts
- backend/.env.example
- frontend/src/components/shared/image-upload-field.tsx
- frontend/src/features/uploads/upload.api.ts
- frontend/src/app/(admin)/admin/categories/page.tsx
- frontend/src/app/(admin)/admin/products/page.tsx
- frontend/src/app/(admin)/admin/settings/page.tsx
- frontend/src/app/(customer)/customer/profile/page.tsx
- frontend/src/app/(shop-owner)/shop-owner/profile/page.tsx
- frontend/src/app/(captain)/captain/orders/[orderId]/page.tsx

### Verification
- Backend no longer depends on local image storage.
- Image entry points upload local files directly to S3.
- Forms store only object keys and render previews from resolved image URLs.

## 2026-04-26 - Customer storefront cleanup and docs refresh

### Type
Frontend and documentation

### Status
Implemented

### Summary
The customer storefront was cleaned up, encoding issues were removed, location prompting was stabilized, stale selected-shop state now falls back safely, and the docs were refreshed to match the current code.

### Updated docs
- docs/README.md
- docs/backend/01-backend-overview-stack.md
- docs/backend/04-infrastructure-security-env.md
- docs/backend/05-transactions-testing-swagger-deployment.md
- docs/frontend/01-frontend-overview.md
- docs/frontend/04-routes-pages.md
- docs/frontend/05-api-integration.md
- docs/frontend/06-state-forms-validation.md
- docs/frontend/07-components-layouts.md
- docs/frontend/CHANGELOG.md
- docs/product/01-product-overview.md
- docs/product/04-api-contracts.md
- docs/product/05-business-rules-statuses.md
- backend/README.md
- frontend/README.md
- README.md

### Files changed
- frontend/src/components/customer/customer-footer.tsx
- frontend/src/app/(customer)/customer/page.tsx
- frontend/src/app/(customer)/customer/products/page.tsx
- frontend/src/constants/query-keys.ts
- frontend/src/features/shops/shop.hooks.ts

### Verification
- Customer storefront renders with the custom header, footer, location banner, and homepage sections intact.
- Nearby shop and product queries recover from stale persisted state.
- Frontend build succeeds after cleanup.

## 2026-04-26 - Shared full-width customer shell refresh

### Type
Frontend and documentation

### Status
Implemented

### Summary
The shared customer header and footer were refreshed into a full-width storefront layout. The same shell remains reused across all customer pages, so home, shops, products, orders, addresses, notifications, checkout, cart, and profile all keep a consistent customer-facing frame.

### Updated docs
- docs/frontend/01-frontend-overview.md
- docs/frontend/04-routes-pages.md
- docs/frontend/07-components-layouts.md
- docs/frontend/CHANGELOG.md
- frontend/README.md
- README.md

### Files changed
- frontend/src/components/customer/customer-storefront-header.tsx
- frontend/src/components/customer/customer-footer.tsx
- frontend/src/components/layout/customer-app-shell.tsx

### Verification
- Shared customer shell renders the same header and footer across customer pages.
- Frontend build succeeds.

## 2026-04-26 - Public landing page storefront refresh

### Type
Frontend and documentation

### Status
Implemented

### Summary
The public `/` landing page was converted from a basic marketing page into a storefront-style catalog experience with a Zepto-style header, browser location label, search bar, category grid, live product sections, and storefront footer.

### Updated docs
- docs/frontend/01-frontend-overview.md
- docs/frontend/04-routes-pages.md
- docs/frontend/07-components-layouts.md
- docs/frontend/CHANGELOG.md
- frontend/README.md
- README.md

### Files changed
- frontend/src/components/layout/public-navbar.tsx
- frontend/src/app/(public)/page.tsx

### Verification
- Public landing page now renders the storefront-style header, search, categories, product sections, and footer.

## 2026-04-27 - Dashboard routing and role-doc alignment

### Type
Frontend and documentation

### Status
Implemented

### Summary
Admin and super-admin dashboard shells were aligned around shared route-level layouts so sidebar and topbar persist during in-section navigation. Markdown files were updated to match the current super-admin route behavior and role home paths.

### Updated docs
- README.md
- frontend/README.md
- docs/product/02-roles-permissions-mvp-scope.md
- docs/product/03-user-flows.md
- docs/frontend/01-frontend-overview.md
- docs/frontend/04-routes-pages.md
- docs/frontend/07-components-layouts.md
- docs/frontend/CHANGELOG.md

### Verification
- Frontend routes now keep super-admin URLs inside `/super-admin/*`.
- Admin and super-admin docs match the current shared-shell behavior and role redirects.

## 2026-04-27 - List-first management flow and mirrored super-admin access

### Type
Frontend and documentation

### Status
Implemented

### Summary
Admin management pages for shops, products, and coupons were shifted toward a cleaner list-first pattern with dedicated create and edit pages. Super-admin now has mirrored management routes for the major admin modules while staying inside `/super-admin/*`.

### Updated docs
- README.md
- frontend/README.md
- docs/frontend/01-frontend-overview.md
- docs/frontend/04-routes-pages.md
- docs/frontend/07-components-layouts.md
- docs/frontend/CHANGELOG.md
- docs/product/03-user-flows.md

### Verification
- Frontend build succeeded after adding the dedicated routes and mirrored super-admin pages.
- Management flows now keep list pages cleaner and preserve the super-admin URL space.

## 2026-04-27 - Captain self-registration and generic delivery-task architecture

### Type
Backend and documentation

### Status
Implemented

### Summary
The backend design was moved away from admin/shop-created captains and toward captain self-registration with admin verification. Delivery orchestration now has a generic `delivery_tasks` layer that can support grocery, parcel, and future logistics services through one captain engine.

### Updated docs
- README.md
- backend/README.md
- docs/backend/01-backend-overview-stack.md
- docs/backend/02-database-schema.md
- docs/backend/03-backend-architecture-standards.md
- docs/backend/04-infrastructure-security-env.md
- docs/backend/05-transactions-testing-swagger-deployment.md
- docs/product/01-product-overview.md
- docs/product/02-roles-permissions-mvp-scope.md
- docs/product/04-api-contracts.md
- docs/product/05-business-rules-statuses.md
- docs/product/06-change-requests.md

### Files changed
- backend/prisma/schema.prisma
- backend/prisma/seed.js
- backend/src/modules/captains/*
- backend/src/modules/delivery-tasks/*
- backend/src/modules/orders/order.service.ts
- backend/src/routes/index.ts
- backend/src/core/utils/geo.ts
- backend/src/realtime/socket-gateway.ts
- backend/src/config/env.ts
- backend/src/constants/error-codes.ts

### Verification
- Backend TypeScript build succeeded after the captain and delivery-task refactor.
- Prisma client was regenerated against the updated schema using a no-engine generation pass.

## 2026-04-27 - Delivery-task documentation alignment

### Type
Documentation

### Status
Implemented

### Summary
The remaining current markdown files were aligned with the captain self-registration and generic delivery-task design. Older references to shop-side captain creation, manual assign-captain actions, and direct captain-order-only APIs were removed from the active docs set.

### Updated docs
- README.md
- docs/README.md
- docs/product/README.md
- docs/product/02-roles-permissions-mvp-scope.md
- docs/product/03-user-flows.md
- docs/product/05-business-rules-statuses.md
- docs/frontend/04-routes-pages.md
- docs/frontend/05-api-integration.md
- docs/frontend/06-state-forms-validation.md
- docs/frontend/08-responsive-performance-seo-accessibility.md
- docs/frontend/09-testing-env-deployment-development-order.md
- frontend/README.md

### Verification
- Active docs now describe captain self-registration, admin-only verification, parcel support, delivery-task APIs, and generic dispatch behavior consistently.

## 2026-04-27 - Permission-noise compatibility cleanup

### Type
Frontend compatibility and behavior alignment

### Status
Implemented

### Summary
Shop-owner order detail screens no longer call admin-only captain availability endpoints, and captain availability/location actions now point at the current captain APIs. This removes avoidable 403 responses caused by stale client integrations after the captain and dispatch refactor.

### Updated files
- frontend/src/features/captain/captain.api.ts
- frontend/src/app/(shop-owner)/shop-owner/shops/[shopId]/orders/[orderId]/page.tsx
- frontend/src/app/(admin)/admin/orders/[orderId]/page.tsx

### Verification
- Frontend compilation and type-checking succeeded.
- Remaining frontend build failure is unrelated and currently tied to the existing `/captain/notifications` page resolution issue.

## 2026-04-27 - Captain task-page separation

### Type
Frontend and documentation

### Status
Implemented

### Summary
Captain pages were separated from the old shared order flow and moved onto captain-specific delivery-task rendering and captain-task actions. This keeps captain login and captain work surfaces aligned with the new `delivery_tasks` backend model.

### Updated files
- frontend/src/types/domain.ts
- frontend/src/features/captain/captain.api.ts
- frontend/src/features/captain/captain.hooks.ts
- frontend/src/components/captain/captain-task-card.tsx
- frontend/src/app/(captain)/captain/page.tsx
- frontend/src/app/(captain)/captain/orders/page.tsx
- frontend/src/app/(captain)/captain/orders/[orderId]/page.tsx
- docs/frontend/04-routes-pages.md
- docs/frontend/05-api-integration.md
- docs/frontend/CHANGELOG.md

### Verification
- Captain pages no longer depend on customer order-card assumptions or old captain order-action payloads.

## 2026-04-27 - Captain API authorization and schema sync fix

### Type
Backend and local database alignment

### Status
Implemented

### Summary
Captain APIs were being blocked because a customer-only delivery tracking router had previously been mounted too broadly. After narrowing that router to route-level guards, the remaining captain failures were caused by local MySQL schema drift. The local database was synced to the current Prisma schema and reseeded.

### Updated files
- backend/src/modules/delivery-tasks/delivery-task.routes.ts
- backend/src/core/middleware/auth-middleware.ts

### Verification
- `POST /api/v1/auth/login` with the seeded captain succeeds.
- `GET /api/v1/captain/me` returns `200`.
- `GET /api/v1/captain/tasks` returns `200`.
- `GET /api/v1/notifications` returns `200`.
