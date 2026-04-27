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
NEXT_PUBLIC_CAPTAIN_LOCATION_MIN_CHANGE_METERS=30
NEXT_PUBLIC_CAPTAIN_LOCATION_MAXIMUM_AGE_MS=15000
NEXT_PUBLIC_CAPTAIN_LOCATION_TIMEOUT_MS=20000
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
features/delivery-tasks/delivery-task.api.ts
features/parcels/parcel.api.ts
features/payments/payment.api.ts
features/coupons/coupon.api.ts
features/uploads/upload.api.ts
features/notifications/notification.api.ts
features/dashboard/dashboard.api.ts
```

## Direct image uploads

Image uploads must use a two-step flow so the same APIs work for web and mobile clients:

```txt
1. POST /uploads/image with filename, contentType, and folder.
2. Receive uploadUrl, imageUrl, method, headers, and key.
3. Upload the binary file directly from the client to S3 using the signed request.
4. Save only key in the form payload sent to profile/category/product/order APIs.
5. Use the returned imageUrl only for preview and rendering.
```

Required behavior:

```txt
Never send image binaries through the Next.js server
Never persist images to local frontend or backend storage
Treat the backend upload endpoint as an authenticated signing API
Allow the same signing contract to be reused by mobile apps
Use imageUrl only for display and preview
Use key or profileImage for submission depending on the API field name
Never render s3:// object paths directly in the browser
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

Use TanStack Query hooks such as `useLoginMutation`, `useProductsQuery`, `useCartQuery`, `usePlaceOrderMutation`, `useShopOrdersQuery`, `useCaptainTasksQuery`, `useCaptainTaskAcceptMutation`, `useCaptainLocationUpdateMutation`, `useAdminCaptainsQuery`, `useAdminDeliveryTasksQuery`, and `useAdminDashboardQuery`.

## Captain and delivery integration rules

Frontend clients should treat the captain and dispatch APIs as cross-client contracts for web and mobile reuse.

Location tracking for captain clients should also follow a shared contract:

```txt
Use the same /captain/location/update API from web and mobile
Use device geolocation as the source of truth for coordinates
Do not send location on a blind every-second timer
Only send updates while the captain is online
Only send updates after meaningful movement, for example 30 meters
Use map providers such as Google Maps or OpenStreetMap only for display, preview, navigation handoff, or directions
```

Required behavior:

```txt
Use /captain/register for self-registration
Use /captain/me and /captain/profile for captain account surfaces
Use /captain/go-online and /captain/go-offline for availability state
Use /captain/location/update for live captain location
Use /captain/tasks/* endpoints for accept, reject, and status progression
Build captain pages against delivery-task responses instead of reusing customer order response assumptions
Treat captain task list responses as map-capable view models with pickup and drop coordinates
Keep a realtime subscription for captain offer arrival, offer expiry, task removal, acceptance, and live task status change
When another captain wins an offer, remove that task card immediately instead of waiting for a poll refresh
Use /orders/:orderId/delivery and /orders/:orderId/tracking for customer delivery tracking
Use /shop/orders/:orderId/delivery and /shop/delivery-tasks/:taskId/tracking for shop delivery tracking
Use /parcels endpoints for parcel creation and self-service parcel history
Do not build shop-side captain creation or approval forms
Do not call or document manual assign-captain APIs
```
