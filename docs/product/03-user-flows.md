# User Flows

This file is the shared source for customer, shop owner, captain, admin, and super admin flows.

---

## Frontend Routes and Page Behavior

# App Routes and Pages

## Public routes

```txt
/
/about
/contact
/terms
/privacy
/support
```

## Auth routes

```txt
/login
/register
/forgot-password
/reset-password
/unauthorized
```

## Customer routes

```txt
/customer
/customer/shops
/customer/shops/[shopId]
/customer/products
/customer/products/[productId]
/customer/categories/[categoryId]
/customer/cart
/customer/checkout
/customer/orders
/customer/orders/[orderId]
/customer/addresses
/customer/profile
/customer/notifications
```

## Captain routes

```txt
/captain
/captain/login
/captain/orders
/captain/orders/[orderId]
/captain/profile
/captain/earnings
/captain/notifications
```

## Shop owner routes

```txt
/shop-owner
/shop-owner/login
/shop-owner/shops
/shop-owner/shops/[shopId]
/shop-owner/shops/[shopId]/dashboard
/shop-owner/shops/[shopId]/inventory
/shop-owner/shops/[shopId]/products
/shop-owner/shops/[shopId]/orders
/shop-owner/shops/[shopId]/orders/[orderId]
/shop-owner/shops/[shopId]/reports
/shop-owner/profile
/shop-owner/notifications
```

## Admin routes

```txt
/admin
/admin/login
/admin/dashboard
/admin/users
/admin/customers
/admin/captains
/admin/shops
/admin/shops/[shopId]
/admin/categories
/admin/products
/admin/inventory
/admin/orders
/admin/orders/[orderId]
/admin/coupons
/admin/reports/sales
/admin/reports/product-sales
/admin/reports/low-stock
/admin/notifications
/admin/settings
```

## Super admin routes

Super admin has its own route space and should stay inside `/super-admin/*`.

```txt
/super-admin
/super-admin/dashboard
/super-admin/admins
/super-admin/settings
/super-admin/audit-logs
```

## Required page behavior

Login page must support all roles and redirect by role. Customer pages must support product browsing, cart, checkout, orders, addresses, profile, and notifications. Shop owner pages must support shops, dashboard, inventory, orders, reports, and open/close status. Captain pages must support online status, location, assigned orders, pickup, delivery, and COD collection. Admin pages must support dashboard, shops, categories, products, orders, captains, coupons, reports, and settings.


---

## Authentication and Role-Based Access

# Authentication and Role-Based Access

## Supported roles

```txt
SUPER_ADMIN
ADMIN
SHOP_OWNER
STORE_MANAGER
CUSTOMER
CAPTAIN
```

## Login API

```http
POST /auth/login
```

After login:

```txt
Store tokens
Load user profile if needed
Redirect based on role
```

## Role redirect rules

```txt
CUSTOMER      -> /customer
CAPTAIN       -> /captain
SHOP_OWNER    -> /shop-owner
STORE_MANAGER -> /shop-owner
ADMIN         -> /admin
SUPER_ADMIN   -> /super-admin/dashboard
```

## Route protection

Create:

```txt
AuthProvider
ProtectedRoute
RoleGuard
```

Rules:

```txt
Unauthenticated user -> /login
Wrong role -> /unauthorized
Expired access token -> refresh token
Refresh token expired -> logout
```

## Auth pages

Login fields:

```txt
mobile
password
deviceType
fcmToken optional
```

Register customer fields:

```txt
name
mobile
email optional
password
confirmPassword
```

Captain registration fields:

```txt
name
mobile
password
vehicleType
vehicleNumber
licenseNumber
```

## Logout

Use:

```http
POST /auth/logout
```

Then clear frontend auth state and redirect to `/login`.

## Change password

Use:

```http
POST /auth/change-password
```

## Unauthorized page

Create `/unauthorized` with message, go back button, dashboard button, and logout button.


---

## Customer Flow

# Customer App Flow

## Customer journey

```txt
Login/Register
Select location/address
View nearby shops
Open shop
Browse categories/products
Add products to cart
Review cart
Checkout
Place order
Track order
Cancel if allowed
Receive notifications
```

## Customer pages

```txt
/customer
/customer/shops
/customer/shops/[shopId]
/customer/products
/customer/products/[productId]
/customer/cart
/customer/checkout
/customer/orders
/customer/orders/[orderId]
/customer/addresses
/customer/profile
/customer/notifications
```

## Home page sections

```txt
Greeting
Location selector
Search bar
Categories
Nearby shops
Popular products
Recent orders
Floating cart bar
Bottom navigation
```

## Product card

Show image, name, brand, unit, MRP, selling price, stock status, add button, and quantity stepper.

## Cart APIs

```http
GET /cart?shopId=uuid
POST /cart/items
PATCH /cart/items/:cartItemId
DELETE /cart/items/:cartItemId
DELETE /cart?shopId=uuid
```

## Checkout

Show selected address, add/change address, order summary, coupon box, payment mode, delivery fee, platform fee, discount, total amount, and place order button.

## Place order API

```http
POST /orders
```

After success, clear cart state and redirect to order details.

## Order APIs

```http
GET /orders/my?status=PLACED&page=1&limit=20
GET /orders/:orderId
POST /orders/:orderId/cancel
```

Cancel button should show only for `PLACED`, `CONFIRMED`, and `PACKING`.

## Bottom navigation

```txt
Home
Search
Cart
Orders
Profile
```


---

## Shop Owner Flow

# Shop Owner Panel Flow

## Shop owner journey

```txt
Login
View owned shops
Open shop dashboard
Manage open/closed status
Manage inventory
View incoming orders
Confirm order
Mark packing
Mark ready for pickup
Assign captain if allowed
Cancel order if needed
View reports
```

## Routes

```txt
/shop-owner
/shop-owner/shops
/shop-owner/shops/[shopId]/dashboard
/shop-owner/shops/[shopId]/inventory
/shop-owner/shops/[shopId]/products
/shop-owner/shops/[shopId]/orders
/shop-owner/shops/[shopId]/orders/[orderId]
/shop-owner/shops/[shopId]/reports
/shop-owner/profile
/shop-owner/notifications
```

## Dashboard API

```http
GET /shop-owner/shops/:shopId/dashboard/summary
```

Show today orders, today revenue, pending orders, delivered orders, cancelled orders, low stock products, recent orders, and quick actions.

## Open status API

```http
PATCH /shop-owner/shops/:shopId/open-status
```

Use a large toggle with clear open/closed badge.

## Inventory APIs

```http
PUT /shop-owner/shops/:shopId/inventory/:productId
POST /shop-owner/shops/:shopId/inventory/bulk
GET /shop-owner/shops/:shopId/inventory
POST /shop-owner/shops/:shopId/inventory/:productId/adjust
```

Inventory UI should show product, unit, availableStock, reservedStock, soldStock, damagedStock, lowStockAlert, isAvailable, and actions.

## Order APIs

```http
GET /shop-owner/shops/:shopId/orders
GET /shop-owner/shops/:shopId/orders/:orderId
POST /shop-owner/orders/:orderId/confirm
POST /shop-owner/orders/:orderId/mark-packing
POST /shop-owner/orders/:orderId/ready-for-pickup
POST /shop-owner/orders/:orderId/cancel
POST /shop-owner/orders/:orderId/assign-captain
```

Order detail actions: Confirm, Mark Packing, Ready for Pickup, Assign Captain, Cancel.

## Reports APIs

```http
GET /shop-owner/shops/:shopId/reports/sales
GET /shop-owner/shops/:shopId/reports/low-stock
```


---

## Captain Flow

# Captain App Flow

## Captain journey

```txt
Login
Go online
Receive assigned order
Accept or reject order
Go to shop pickup
Mark picked up
Go to customer address
Collect COD if applicable
Mark delivered
Upload delivery proof if available
Go offline
```

## Routes

```txt
/captain
/captain/orders
/captain/orders/[orderId]
/captain/profile
/captain/earnings
/captain/notifications
```

## Dashboard

Show online/offline toggle, availability, assigned orders, active delivery, today delivered count, and cash in hand.

## Online and location APIs

```http
PATCH /captains/me/online-status
PATCH /captains/me/location
```

Ask location permission, handle denied permission, and allow retry.

## Captain order APIs

```http
GET /captains/me/orders
POST /captains/orders/:orderId/accept
POST /captains/orders/:orderId/reject
POST /captains/orders/:orderId/picked-up
POST /captains/orders/:orderId/delivered
```

## Delivered form

```txt
paymentCollected
collectedAmount
deliveryProofImage optional
```

For COD, paymentCollected and collectedAmount are required.

## Captain UI

Mobile-first, large buttons, sticky bottom action bar, pickup card, delivery card, COD alert card, and clear status badges.


---

## Admin and Super Admin Flow

# Admin and Super Admin Panel Flow

## Purpose

Admin panel manages the whole MVP platform. Super admin has full access.

## Admin routes

```txt
/admin/dashboard
/admin/users
/admin/customers
/admin/captains
/admin/shops
/admin/shops/[shopId]
/admin/categories
/admin/products
/admin/inventory
/admin/orders
/admin/orders/[orderId]
/admin/coupons
/admin/reports/sales
/admin/reports/product-sales
/admin/reports/low-stock
/admin/notifications
/admin/settings
```

## Super admin routes

```txt
/super-admin/dashboard
/super-admin/admins
/super-admin/audit-logs
/super-admin/settings
```

Current implementation note:

```txt
Super-admin pages stay under /super-admin/*
Super-admin shell is shared at the route-layout level
Sidebar and topbar should persist while only page content changes
```

## Dashboard API

```http
GET /admin/dashboard/summary
```

Show totalOrders, todayOrders, todayRevenue, activeCustomers, activeShops, activeCaptains, pendingOrders, cancelledOrders, charts, recent orders, and low stock alerts.

## Category APIs

```http
GET /categories
POST /admin/categories
PATCH /admin/categories/:categoryId
DELETE /admin/categories/:categoryId
```

## Product APIs

```http
GET /products
POST /admin/products
PATCH /admin/products/:productId
DELETE /admin/products/:productId
```

## Shop APIs

```http
GET /shops/nearby
GET /shops/:shopId
POST /admin/shops
PATCH /admin/shops/:shopId
```

## Order APIs

```http
GET /admin/orders
GET /admin/orders/:orderId
PATCH /admin/orders/:orderId/status
POST /admin/orders/:orderId/assign-captain
```

## Coupon APIs

```http
POST /admin/coupons
PATCH /admin/coupons/:couponId
DELETE /admin/coupons/:couponId
POST /coupons/validate
```

## Reports APIs

```http
GET /admin/reports/sales
GET /admin/reports/product-sales
GET /admin/reports/low-stock
```

## Layout

Use desktop sidebar and topbar. On mobile use drawer, cards instead of wide tables, and bottom sheet actions.
