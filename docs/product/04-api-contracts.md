# API Contracts

This file is the shared source of truth for backend API endpoints and frontend API integration.

---

## Backend API Contracts — Auth, Profile, Addresses

# APIs — Auth, Profile, Addresses

# 9. API Endpoints

---

# 9.1 Auth APIs

## Register Customer

```http
POST /auth/customer/register
```

Request:

```json
{
  "name": "Arun",
  "mobile": "9876543210",
  "email": "arun@example.com",
  "password": "Password@123"
}
```

---

## Login

```http
POST /auth/login
```

Request:

```json
{
  "mobile": "9876543210",
  "password": "Password@123",
  "deviceType": "WEB",
  "fcmToken": "optional"
}
```

Response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token",
    "user": {
      "id": "uuid",
      "name": "Arun",
      "mobile": "9876543210",
      "role": "CUSTOMER"
    }
  }
}
```

---

## Refresh Token

```http
POST /auth/refresh-token
```

Request:

```json
{
  "refreshToken": "refresh_token"
}
```

---

## Logout

```http
POST /auth/logout
```

Auth required: Yes

---

## Change Password

```http
POST /auth/change-password
```

Auth required: Yes

Request:

```json
{
  "oldPassword": "Old@123",
  "newPassword": "New@123"
}
```

---

---

# 9.2 Profile APIs

```http
GET /users/me
PATCH /users/me
```

Update request:

```json
{
  "name": "Arun Sai",
  "email": "arun@example.com",
  "profileImage": "image_url"
}
```

---

---

# 9.3 Customer Address APIs

```http
POST /customer/addresses
GET /customer/addresses
PATCH /customer/addresses/:addressId
DELETE /customer/addresses/:addressId
PATCH /customer/addresses/:addressId/default
```

Create request:

```json
{
  "fullName": "Arun",
  "mobile": "9876543210",
  "houseNo": "1-23",
  "street": "Main Road",
  "landmark": "Near Temple",
  "village": "My Village",
  "mandal": "Mandal Name",
  "district": "District Name",
  "state": "Andhra Pradesh",
  "pincode": "533001",
  "latitude": 16.1234567,
  "longitude": 82.1234567,
  "addressType": "HOME",
  "isDefault": true
}
```

---

---


---

## Backend API Contracts — Catalog, Shops, Inventory, Cart

# APIs — Catalog, Shops, Inventory, Cart

# 9.4 Category APIs

## Public

```http
GET /categories
```

## Admin

```http
POST /admin/categories
PATCH /admin/categories/:categoryId
DELETE /admin/categories/:categoryId
```

Create request:

```json
{
  "name": "Vegetables",
  "imageUrl": "url",
  "parentId": null,
  "sortOrder": 1
}
```

---

---

# 9.5 Product APIs

## Public Product List

```http
GET /products?shopId=uuid&categoryId=uuid&search=milk&page=1&limit=20
```

Response item:

```json
{
  "id": "uuid",
  "name": "Milk",
  "categoryId": "uuid",
  "brand": "Brand Name",
  "unit": "500 ml",
  "mrp": 35,
  "sellingPrice": 32,
  "imageUrl": "url",
  "availableStock": 10,
  "isAvailable": true
}
```

## Product Details

```http
GET /products/:productId?shopId=uuid
```

## Admin Product Management

```http
POST /admin/products
PATCH /admin/products/:productId
DELETE /admin/products/:productId
```

Create request:

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
  "imageUrl": "url"
}
```

---

---

# 9.6 Shop APIs

## Public

```http
GET /shops/nearby?village=VillageName&pincode=533001
GET /shops/:shopId
```

## Admin

```http
POST /admin/shops
PATCH /admin/shops/:shopId
```

Create request:

```json
{
  "ownerId": "uuid",
  "name": "Sai Grocery Store",
  "mobile": "9876543210",
  "email": "shop@example.com",
  "address": "Main Road",
  "village": "Village Name",
  "pincode": "533001",
  "latitude": 16.1234567,
  "longitude": 82.1234567,
  "openingTime": "07:00",
  "closingTime": "22:00"
}
```

## Shop Owner Open Status

```http
PATCH /shop-owner/shops/:shopId/open-status
```

Request:

```json
{
  "isOpen": true
}
```

---

---

# 9.7 Inventory APIs

```http
PUT /shop-owner/shops/:shopId/inventory/:productId
POST /shop-owner/shops/:shopId/inventory/bulk
GET /shop-owner/shops/:shopId/inventory
POST /shop-owner/shops/:shopId/inventory/:productId/adjust
```

Update request:

```json
{
  "availableStock": 100,
  "lowStockAlert": 10,
  "isAvailable": true
}
```

Adjust request:

```json
{
  "quantity": 10,
  "adjustmentType": "ADD",
  "remarks": "New stock received"
}
```

Allowed adjustment types:

```txt
ADD
REMOVE
SET
DAMAGED
```

---

---

# 9.8 Cart APIs

```http
GET /cart?shopId=uuid
POST /cart/items
PATCH /cart/items/:cartItemId
DELETE /cart/items/:cartItemId
DELETE /cart?shopId=uuid
```

Add item request:

```json
{
  "shopId": "uuid",
  "productId": "uuid",
  "quantity": 2
}
```

Rules:

```txt
Check product is active
Check shop inventory exists
Check availableStock >= requested quantity
If item already exists, increase quantity
Cart should belong to one shop only
```

---

---


---

## Backend API Contracts — Orders, Delivery, Payments

# APIs — Orders, Delivery, Payments

# 9.9 Customer Order APIs

## Place Order

```http
POST /orders
```

Request:

```json
{
  "shopId": "uuid",
  "addressId": "uuid",
  "paymentMode": "COD",
  "couponCode": null,
  "customerNotes": "Please deliver fast"
}
```

Backend must:

```txt
Validate customer
Validate address belongs to customer
Validate shop is active and open
Validate cart is not empty
Validate product stock
Calculate subtotal
Calculate delivery fee
Apply coupon if any
Create order
Create order_items
Reserve stock atomically
Clear cart
Create payment record
Create order status history
Send notification to shop owner/admin
```

Stock reservation:

```txt
availableStock = availableStock - orderedQty
reservedStock = reservedStock + orderedQty
```

## Customer Order List

```http
GET /orders/my?status=PLACED&page=1&limit=20
```

## Customer Order Details

```http
GET /orders/:orderId
```

## Cancel Customer Order

```http
POST /orders/:orderId/cancel
```

Request:

```json
{
  "reason": "Ordered by mistake"
}
```

Allowed cancellation statuses:

```txt
PLACED
CONFIRMED
PACKING
```

---

---

# 9.10 Shop Owner Order APIs

```http
GET /shop-owner/shops/:shopId/orders
GET /shop-owner/shops/:shopId/orders/:orderId
POST /shop-owner/orders/:orderId/confirm
POST /shop-owner/orders/:orderId/mark-packing
POST /shop-owner/orders/:orderId/ready-for-pickup
POST /shop-owner/orders/:orderId/cancel
POST /shop-owner/orders/:orderId/assign-captain
```

Cancel request:

```json
{
  "reason": "Item unavailable"
}
```

---

---

# 9.11 Admin Order APIs

```http
GET /admin/orders
GET /admin/orders/:orderId
PATCH /admin/orders/:orderId/status
POST /admin/orders/:orderId/assign-captain
```

Status update request:

```json
{
  "status": "CONFIRMED",
  "remarks": "Updated by admin"
}
```

---

---

# 9.12 Captain APIs

## Register Captain

```http
POST /captains/register
```

Request:

```json
{
  "name": "Ravi",
  "mobile": "9876543210",
  "password": "Password@123",
  "vehicleType": "BIKE",
  "vehicleNumber": "AP00AB1234",
  "licenseNumber": "DL123456"
}
```

## Captain Status and Location

```http
PATCH /captains/me/online-status
PATCH /captains/me/location
```

Online request:

```json
{
  "isOnline": true,
  "latitude": 16.1234567,
  "longitude": 82.1234567
}
```

## Captain Orders

```http
GET /captains/me/orders
POST /captains/orders/:orderId/accept
POST /captains/orders/:orderId/reject
POST /captains/orders/:orderId/picked-up
POST /captains/orders/:orderId/delivered
```

Delivered request:

```json
{
  "paymentCollected": true,
  "collectedAmount": 350,
  "deliveryProofImage": "optional_url"
}
```

On delivery:

```txt
order status = DELIVERED
reservedStock = reservedStock - qty
soldStock = soldStock + qty
paymentStatus = COD_COLLECTED if COD
captain cashInHand += collected COD amount
```

---

---

# 9.13 Delivery Assignment APIs

```http
GET /admin/captains/available
POST /admin/orders/:orderId/assign-captain
POST /shop-owner/orders/:orderId/assign-captain
```

Assign request:

```json
{
  "captainId": "uuid"
}
```

Allowed order status:

```txt
READY_FOR_PICKUP
```

New order status:

```txt
ASSIGNED_TO_CAPTAIN
```

---

---

# 9.14 Payment APIs

```http
POST /payments/razorpay/create-order
POST /payments/razorpay/verify
POST /payments/manual-upi/mark-paid
```

Manual UPI request:

```json
{
  "orderId": "uuid",
  "transactionReference": "UPI123456"
}
```

For MVP, COD + manual UPI is enough.

---

---

# 9.15 Coupon APIs

```http
POST /coupons/validate
POST /admin/coupons
PATCH /admin/coupons/:couponId
DELETE /admin/coupons/:couponId
```

Validate request:

```json
{
  "shopId": "uuid",
  "couponCode": "FIRST50",
  "cartAmount": 500
}
```

---

---


---

## Backend API Contracts — Uploads, Notifications, Dashboards

# APIs — Uploads, Notifications, Dashboards

# 9.16 Upload APIs

```http
POST /uploads/image
```

Form-data:

```txt
file: image
folder: products | categories | shops | delivery-proof
```

Validation:

```txt
Allowed types: jpg, jpeg, png, webp
Max size: 5 MB
```

---

---

# 9.17 Notification APIs

```http
GET /notifications
PATCH /notifications/:notificationId/read
POST /notifications/register-device
```

Register device request:

```json
{
  "fcmToken": "token",
  "deviceType": "ANDROID"
}
```

---

---

# 9.18 Admin Dashboard APIs

```http
GET /admin/dashboard/summary
GET /admin/reports/sales
GET /admin/reports/product-sales
GET /admin/reports/low-stock
```

Dashboard response:

```json
{
  "success": true,
  "data": {
    "totalOrders": 1000,
    "todayOrders": 50,
    "todayRevenue": 25000,
    "activeCustomers": 500,
    "activeShops": 5,
    "activeCaptains": 10,
    "pendingOrders": 8,
    "cancelledOrders": 3
  }
}
```

---

---

# 9.19 Shop Owner Dashboard APIs

```http
GET /shop-owner/shops/:shopId/dashboard/summary
GET /shop-owner/shops/:shopId/reports/sales
GET /shop-owner/shops/:shopId/reports/low-stock
```

Summary response:

```json
{
  "success": true,
  "data": {
    "todayOrders": 20,
    "todayRevenue": 10000,
    "pendingOrders": 5,
    "deliveredOrders": 15,
    "cancelledOrders": 1,
    "lowStockProducts": 12
  }
}
```

---


---

## Frontend API Integration Requirements

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

