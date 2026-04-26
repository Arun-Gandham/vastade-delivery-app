# Frontend Specification Docs — Quick Commerce MVP

This folder contains the **frontend-only development specification** for a small-scale Zepto / Instamart / Swiggy Instamart-style quick-commerce application using:

```txt
Next.js + TypeScript + Tailwind CSS
```

The frontend must connect directly to the existing backend APIs documented in:

```txt
docs/backend/
```

## Recommended reading order

1. [Overview](./01-overview.md)
2. [Frontend Stack and Architecture](./02-stack-architecture.md)
3. [Theme, Design System, and UI Rules](./03-theme-design-system.md)
4. [App Routes and Pages](./04-routes-pages.md)
5. [Authentication and Role-Based Access](./05-auth-role-access.md)
6. [Customer App Flow](./06-customer-flow.md)
7. [Shop Owner Panel Flow](./07-shop-owner-flow.md)
8. [Captain App Flow](./08-captain-flow.md)
9. [Admin and Super Admin Panel Flow](./09-admin-super-admin-flow.md)
10. [API Integration Layer](./10-api-integration.md)
11. [State Management, Forms, and Validation](./11-state-forms-validation.md)
12. [Components and UI Layouts](./12-components-ui-layouts.md)
13. [Responsive, Performance, SEO, and Accessibility](./13-responsive-performance-seo-accessibility.md)
14. [Testing, Environment, Deployment, and Development Order](./14-testing-env-deployment-development-order.md)

## Suggested project docs folder

```txt
docs/
  frontend/
    README.md
    01-overview.md
    02-stack-architecture.md
    03-theme-design-system.md
    04-routes-pages.md
    05-auth-role-access.md
    06-customer-flow.md
    07-shop-owner-flow.md
    08-captain-flow.md
    09-admin-super-admin-flow.md
    10-api-integration.md
    11-state-forms-validation.md
    12-components-ui-layouts.md
    13-responsive-performance-seo-accessibility.md
    14-testing-env-deployment-development-order.md
    CHANGELOG.md
```

## How to update in future

- New page or route: update `04-routes-pages.md`.
- Login or role permission change: update `05-auth-role-access.md`.
- Customer ordering change: update `06-customer-flow.md`.
- Shop owner feature change: update `07-shop-owner-flow.md`.
- Captain delivery change: update `08-captain-flow.md`.
- Admin or super admin change: update `09-admin-super-admin-flow.md`.
- Backend API URL, request, response, token, or error handling change: update `10-api-integration.md`.
- Theme, color, button, card, layout, or component style change: update `03-theme-design-system.md` and `12-components-ui-layouts.md`.
- Always add a summary entry in `CHANGELOG.md`.

## Important instruction for Codex

This is an MVP frontend. Build only what is documented here unless the docs are updated.
