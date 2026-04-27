# Frontend Changelog

## 2026-04-26

### Added
- Initial frontend specification split into dedicated markdown files.
- Role-based routes for customer, captain, shop owner, admin, and super admin.
- Shared typed API modules, route protection, dashboard shells, and form flows.

### Implemented
- Live API wiring for auth, cart, checkout, orders, addresses, notifications, profiles, shop-owner flows, captain flows, and admin flows.
- Responsive storefront and dashboard coverage using reusable cards, shells, tables, forms, and state components.

## 2026-04-26

### Added
- Shared image upload field for profile, category, product, and delivery-proof flows.
- Backend-signed direct-to-S3 upload support.
- Local preview for newly selected files and existing saved images during edit flows.

### Changed
- Replaced manual image URL entry with local file selection where the frontend captures images.
- Frontend now stores only S3 object keys in form state and renders using resolved `imageUrl` values.

## 2026-04-26

### Changed
- Cleaned the customer storefront home page and footer to remove encoding corruption.
- Stabilized customer location prompting when no saved address or saved location exists.
- Added fallback handling for stale selected shop state so nearby products still render after reloads.
- Updated frontend docs to reflect the current object-key storage and resolved image URL contract.

## 2026-04-26

### Changed
- Refreshed the shared customer header into a full-width storefront bar with logo, delivery context, search, auth actions, and cart action.
- Refreshed the shared customer footer into a wider storefront footer with links, category shortcuts, support details, and app/social actions.
- Kept the same shared `CustomerAppShell` contract across all customer pages so the frame stays consistent.

## 2026-04-26

### Changed
- Replaced the old public landing page marketing navbar with a Zepto-style storefront header.
- Added browser-location display, storefront search, live category tiles, live product sections, and storefront footer to `/`.
- Updated frontend docs so the public landing page is documented as a catalog-driven storefront surface.

## 2026-04-26

### Changed
- Unified the shared layout language across public, customer, captain, admin, shop-owner, and super-admin surfaces through common header, footer, sidebar, topbar, and bottom-nav components.
- Refined the customer footer into a smaller, lighter storefront footer.
- Refreshed dashboard shells into a more enterprise-style navigation and control surface.

## 2026-04-27

### Changed
- Updated frontend docs so typography scale, spacing, search sizing, footer density, and dashboard chrome reflect the current public-page design language.
- Updated docs to reflect shared route-level dashboard layouts for admin and super-admin, plus the current `SUPER_ADMIN -> /super-admin/dashboard` redirect behavior.
