# Frontend Stack and Architecture

## Recommended stack

```txt
Framework: Next.js 15+
Language: TypeScript
Styling: Tailwind CSS
UI Components: Custom components + shadcn/ui style patterns
Icons: lucide-react
Forms: react-hook-form
Validation: zod
HTTP Client: axios or fetch wrapper
Server State: TanStack Query
Client State: Zustand or React Context
Tables: TanStack Table
Charts: Recharts
Toast: sonner or react-hot-toast
Date Handling: date-fns
Auth Storage: httpOnly cookie preferred, fallback localStorage for MVP
```

## Recommended frontend structure

```txt
src/
  app/
    (public)/
    (auth)/
    (customer)/
    (captain)/
    (shop-owner)/
    (admin)/
    (super-admin)/
  components/
    ui/
    layout/
    cards/
    forms/
    tables/
    dialogs/
    product/
    cart/
    order/
    dashboard/
  config/
    theme.config.ts
    routes.config.ts
    roles.config.ts
    api.config.ts
  constants/
    enums.ts
    error-codes.ts
    query-keys.ts
  features/
    auth/
    customer/
    addresses/
    shops/
    categories/
    products/
    inventory/
    cart/
    orders/
    captain/
    payments/
    coupons/
    uploads/
    notifications/
    dashboard/
  hooks/
  lib/
    api/
    auth/
    storage/
    utils/
  providers/
  store/
  types/
  validations/
```

## Feature folder standard

Each feature should have:

```txt
feature.api.ts
feature.types.ts
feature.validation.ts
feature.hooks.ts
feature.components.tsx
```

Example:

```txt
features/orders/
  order.api.ts
  order.types.ts
  order.validation.ts
  order.hooks.ts
  components/
    OrderCard.tsx
    OrderStatusBadge.tsx
    OrderTimeline.tsx
```

## App Router layout groups

Use route groups to separate role experiences:

```txt
app/
  (public)/
    page.tsx
  (auth)/
    login/
    register/
  (customer)/
    customer/
  (captain)/
    captain/
  (shop-owner)/
    shop-owner/
  (admin)/
    admin/
  (super-admin)/
    super-admin/
```

## Layout responsibility

```txt
Public layout: landing/home pages
Auth layout: login/register forms
Customer layout: mobile-first app shell with bottom nav
Captain layout: mobile-first delivery app shell
Shop owner layout: sidebar + topbar dashboard
Admin layout: sidebar + topbar dashboard
Super admin layout: admin layout with full permissions
```

## Coding rules

```txt
No hardcoded API URLs
No hardcoded theme colors inside components
No business rules duplicated incorrectly
No direct axios calls inside page components
No role checking only in UI; use route guards also
No large page files; split components
Use typed API responses
Use reusable loading, error, empty, and confirmation components
```
