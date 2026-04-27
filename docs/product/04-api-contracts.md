# API Contracts

This file is the shared source of truth for the current backend and frontend API contract.

## Response envelope

Success:

```json
{
  "success": true,
  "message": "Success message",
  "data": {},
  "meta": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Error message",
  "errorCode": "ERROR_CODE",
  "errors": []
}
```

## Auth and profile

Endpoints:

```txt
POST /auth/customer/register
POST /auth/login
POST /auth/refresh-token
POST /auth/logout
POST /auth/change-password
POST /captain/register
POST /captain/login
GET /users/me
PATCH /users/me
```

## Captain self-registration

Endpoints:

```txt
POST /captain/register
POST /captain/login
GET /captain/me
PUT /captain/profile
POST /captain/go-online
POST /captain/go-offline
POST /captain/location/update
POST /captain/documents/upload
GET /captain/documents
DELETE /captain/documents/:id
```

Profile update request:

```json
{
  "name": "Arun Sai",
  "email": "arun@example.com",
  "profileImage": "qa/profiles/2026-04-26/avatar.jpg"
}
```

Profile read response fields:

```json
{
  "profileImage": "qa/profiles/2026-04-26/avatar.jpg",
  "profileImageUrl": "https://browser-safe-url"
}
```

## Customer addresses

Endpoints:

```txt
POST /customer/addresses
GET /customer/addresses
PATCH /customer/addresses/:addressId
DELETE /customer/addresses/:addressId
PATCH /customer/addresses/:addressId/default
```

## Catalog

Category endpoints:

```txt
GET /categories
POST /admin/categories
PATCH /admin/categories/:categoryId
DELETE /admin/categories/:categoryId
```

Category write payload:

```json
{
  "name": "Vegetables",
  "imageUrl": "qa/categories/2026-04-26/vegetables.jpg",
  "parentId": null,
  "sortOrder": 1
}
```

Category read shape:

```json
{
  "id": "uuid",
  "name": "Vegetables",
  "imageKey": "qa/categories/2026-04-26/vegetables.jpg",
  "imageUrl": "https://browser-safe-url"
}
```

Product endpoints:

```txt
GET /products?shopId=uuid&categoryId=uuid&search=milk&page=1&limit=20
GET /products/:productId?shopId=uuid
POST /admin/products
PATCH /admin/products/:productId
DELETE /admin/products/:productId
```

Product write payload:

```json
{
  "categoryId": "uuid",
  "name": "Milk",
  "description": "Fresh milk",
  "brand": "Brand Name",
  "unit": "ml",
  "unitValue": 500,
  "mrp": 35,
  "sellingPrice": 32,
  "barcode": "1234567890",
  "imageUrl": "qa/products/2026-04-26/milk.jpg"
}
```

Product read shape:

```json
{
  "id": "uuid",
  "name": "Milk",
  "categoryId": "uuid",
  "brand": "Brand Name",
  "unit": "500 ml",
  "mrp": 35,
  "sellingPrice": 32,
  "imageKey": "qa/products/2026-04-26/milk.jpg",
  "imageUrl": "https://browser-safe-url",
  "availableStock": 10,
  "isAvailable": true
}
```

Shop endpoints:

```txt
GET /shops/nearby?village=VillageName&pincode=533001
GET /shops/:shopId
POST /admin/shops
PATCH /admin/shops/:shopId
PATCH /shop-owner/shops/:shopId/open-status
```

## Cart and orders

Cart endpoints:

```txt
GET /cart?shopId=uuid
POST /cart/items
PATCH /cart/items/:cartItemId
DELETE /cart/items/:cartItemId
DELETE /cart?shopId=uuid
```

Order endpoints:

```txt
POST /orders
GET /orders/my?status=PENDING&page=1&limit=20
GET /orders/:orderId
POST /orders/:orderId/cancel
GET /orders/:orderId/delivery
GET /orders/:orderId/tracking
```

Shop-owner order endpoints:

```txt
GET /shop-owner/shops/:shopId/orders
GET /shop-owner/shops/:shopId/orders/:orderId
PATCH /shop-owner/orders/:orderId/accept
PATCH /shop-owner/orders/:orderId/ready-for-pickup
POST /shop-owner/orders/:orderId/cancel
GET /shop/orders/:orderId/delivery
GET /shop/delivery-tasks/:taskId
GET /shop/delivery-tasks/:taskId/tracking
```

Captain order endpoints:

```txt
GET /captain/orders/available
GET /captain/orders/active
PATCH /captain/orders/:orderId/accept
PATCH /captain/orders/:orderId/picked-up
PATCH /captain/orders/:orderId/delivered
```

Captain task list response shape:

```json
{
  "id": "task_uuid",
  "taskType": "grocery",
  "status": "offered_to_captains",
  "offerStatus": "sent",
  "referenceTable": "orders",
  "referenceId": "order_uuid",
  "pickupAddress": "Shop address line",
  "pickupLatitude": 17.4412,
  "pickupLongitude": 78.3912,
  "dropAddress": "Customer address line",
  "dropLatitude": 17.4522,
  "dropLongitude": 78.4031,
  "captainToPickupDistanceKm": 1.4,
  "pickupToDropDistanceKm": 4.8,
  "estimatedPickupMinutes": 6,
  "estimatedDeliveryMinutes": 18,
  "estimatedEarning": 72,
  "offerExpiresAt": "2026-04-27T10:45:00.000Z",
  "map": {
    "pickup": {
      "lat": 17.4412,
      "lng": 78.3912
    },
    "drop": {
      "lat": 17.4522,
      "lng": 78.4031
    }
  }
}
```

Captain location update:

```json
{
  "latitude": 17.0,
  "longitude": 78.0,
  "heading": 120,
  "speed": 30
}
```

Captain task accept success notes:

```txt
winner captain receives assigned order payload
losing captains receive realtime remove-from-available update
customer, shop, and admin receive assigned and delivery-status events
```

Suggested realtime delivery socket events:

```txt
order:available-for-captains
order:assigned
order:remove-from-available
order:ready-for-pickup
order:picked-up
order:delivered
```

Realtime dispatch rule:

```txt
when admin or shop accepts an order, backend should create or reuse the order delivery_task and broadcast the offer over sockets to all eligible nearby captains
the same order may be visible to multiple captains at once
first successful acceptance wins and removes the order from every other captain dashboard
```

Admin captain and delivery endpoints:

```txt
GET /admin/captains
GET /admin/captains/:id
POST /admin/captains/:id/approve
POST /admin/captains/:id/reject
POST /admin/captains/:id/block
POST /admin/captains/:id/unblock
GET /admin/captains/:id/documents
GET /admin/captains/:id/deliveries
GET /admin/captains/:id/earnings
GET /admin/delivery-tasks
GET /admin/delivery-tasks/:id
```

Tracking read models:

```txt
GET /orders/:orderId/tracking
GET /shop/delivery-tasks/:taskId/tracking
GET /admin/delivery-tasks/:id
```

Tracking payload should expose:

```json
{
  "taskId": "task_uuid",
  "status": "picked_up",
  "pickup": {
    "address": "Pickup address",
    "latitude": 17.4412,
    "longitude": 78.3912
  },
  "drop": {
    "address": "Drop address",
    "latitude": 17.4522,
    "longitude": 78.4031
  },
  "captain": {
    "name": "Ravi Kumar",
    "phone": "98xxxxxx10",
    "vehicleType": "bike",
    "vehicleNumberMasked": "TS09****1234"
  },
  "liveLocation": {
    "latitude": 17.447,
    "longitude": 78.396,
    "heading": 100,
    "speed": 24,
    "updatedAt": "2026-04-27T10:44:30.000Z"
  }
}
```

Parcel endpoints:

```txt
POST /parcels
GET /parcels/my
GET /parcels/:id
POST /parcels/:id/cancel
```

## Upload contract

Endpoint:

```http
POST /uploads/image
```

Request body:

```json
{
  "filename": "vegetables.jpg",
  "contentType": "image/jpeg",
  "folder": "categories"
}
```

Response data:

```json
{
  "uploadUrl": "https://signed-put-url",
  "method": "PUT",
  "headers": {
    "Content-Type": "image/jpeg"
  },
  "key": "qa/categories/2026-04-26/vegetables.jpg",
  "imageUrl": "https://browser-safe-url"
}
```

Rules:

- upload signing is authenticated
- client uploads directly to S3
- client stores only `key` in subsequent form submissions
- frontend uses `imageUrl` only for preview and rendering

## Public vs private bucket read behavior

If `S3_BUCKET_PUBLIC=true`:

```txt
imageUrl = S3_PUBLIC_BASE_URL + normalized relative key
```

If `S3_BUCKET_PUBLIC=false`:

```txt
backend resolves a presigned GET URL with inline content disposition
```

## Frontend integration rule

Frontend must never use `s3://...` values for rendering. Image elements must use only the browser-safe `imageUrl` returned by the backend.
