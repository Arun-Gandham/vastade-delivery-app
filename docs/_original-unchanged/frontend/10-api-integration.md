# API Integration Layer

## API base URL

Create:

```txt
src/config/api.config.ts
```

Example:

```ts
export const apiConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1",
  timeout: 30000,
};
```

## Environment variable

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_APP_NAME=Quick Commerce
```

## API client

Create:

```txt
src/lib/api/api-client.ts
```

Required behavior:

```txt
Attach access token
Handle 401
Refresh token
Retry original request once
Normalize backend error response
Show toast where needed
```

## Typed API modules

```txt
features/auth/auth.api.ts
features/users/user.api.ts
features/addresses/address.api.ts
features/shops/shop.api.ts
features/categories/category.api.ts
features/products/product.api.ts
features/inventory/inventory.api.ts
features/cart/cart.api.ts
features/orders/order.api.ts
features/captain/captain.api.ts
features/payments/payment.api.ts
features/coupons/coupon.api.ts
features/uploads/upload.api.ts
features/notifications/notification.api.ts
features/dashboard/dashboard.api.ts
```

## Standard response handling

Support backend success and error response formats:

```json
{
  "success": true,
  "message": "Success message",
  "data": {},
  "meta": {}
}
```

```json
{
  "success": false,
  "message": "Error message",
  "errorCode": "ERROR_CODE",
  "errors": []
}
```

## Query hooks

Use TanStack Query hooks such as `useLoginMutation`, `useProductsQuery`, `useCartQuery`, `usePlaceOrderMutation`, `useShopOrdersQuery`, `useCaptainOrdersQuery`, and `useAdminDashboardQuery`.
