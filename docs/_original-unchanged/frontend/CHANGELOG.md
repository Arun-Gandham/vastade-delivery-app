# Frontend Spec Changelog

## 2026-04-26

### Added
- Initial frontend specification split into multiple Markdown files.
- Added Next.js + TypeScript + Tailwind CSS architecture.
- Added role-based routes for customer, captain, shop owner, admin, and super admin.
- Added customer ordering flow.
- Added shop owner inventory/order flow.
- Added captain delivery flow.
- Added admin/super admin panel flow.
- Added theme configuration requirement.
- Added API integration mapping to backend APIs.
- Added component, testing, deployment, and development order docs.

### Implemented
- Added centralized theme variables, route configuration, auth storage, middleware guards, and typed API services wired to the documented backend endpoints.
- Implemented responsive public, auth, customer, captain, shop-owner, admin, and super-admin route coverage using reusable shells, cards, forms, tables, and state components.
- Connected customer cart, checkout, orders, addresses, notifications, and profile flows to live APIs with validation and query hooks.
- Connected shop-owner dashboard, inventory, orders, and reports flows to live APIs, including order status actions and captain assignment.
- Connected captain online status, assigned orders, pickup, delivery, earnings, and notification flows to live APIs.
- Connected admin dashboard, categories, products, shops, orders, captains, inventory reports, coupons, notifications, and settings flows to available backend APIs.
- Added critical unit tests for route protection, cart summary logic, and auth validation.
