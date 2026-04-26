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
/super-admin/admins
/super-admin/audit-logs
/super-admin/platform-settings
```

These can be placeholders if backend is not ready.

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
