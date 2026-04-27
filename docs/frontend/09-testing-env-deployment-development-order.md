# Testing, Environment, Deployment, and Development Order

## Environment variables

Create `.env.example`:

```env
NEXT_PUBLIC_APP_NAME=Quick Commerce
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_DEFAULT_LATITUDE=
NEXT_PUBLIC_DEFAULT_LONGITUDE=
NEXT_PUBLIC_SUPPORT_PHONE=
NEXT_PUBLIC_SUPPORT_EMAIL=
```

## Commands

```bash
npm install
npm run dev
npm run build
npm run start
npm run lint
```

## Testing stack

```txt
Unit/component: Vitest + React Testing Library
E2E: Playwright
Mocking: MSW optional
```

## E2E flows

Test customer login, add to cart, place order, cancel order, shop owner confirm order, shop owner mark ready for pickup, delivery-task creation, captain self-registration, admin captain approval, captain go online, captain accept task, captain mark picked up, captain mark delivered, parcel creation, customer tracking, and admin dashboard.

## Deployment

Deploy to Vercel or Docker + Nginx. Include Dockerfile and `.dockerignore`.

## Development order

```txt
1. Project setup
2. Theme config and Tailwind setup
3. Base UI components
4. API client
5. Auth provider and role guards
6. Login/register pages
7. Customer layout
8. Customer shops/products/cart/checkout/orders
9. Shop owner layout and dashboard
10. Shop owner inventory and order flow
11. Captain layout and self-registration plus delivery-task flow
12. Admin layout and dashboard
13. Admin category/product/shop/order pages
14. Notifications
15. Upload integration
16. Reports
17. Responsive polish
18. Error/loading/empty states
19. Tests
20. Deployment setup
```

## Codex implementation prompt

```md
I already have backend docs in docs/backend and frontend docs in docs/frontend.

Build the frontend using Next.js, TypeScript, and Tailwind CSS.

Start with docs/frontend/README.md and follow the reading order.

Connect to backend APIs from docs/backend.

Do not create mock-only UI. Use typed API integration files.

Build step by step:
1. setup
2. theme
3. reusable UI components
4. auth
5. role-based layouts
6. customer flow
7. shop owner flow
8. captain flow
9. admin flow

Keep colors in src/config/theme.config.ts and CSS variables.
Do not hardcode colors inside pages.
Do not implement undocumented future features.
```
