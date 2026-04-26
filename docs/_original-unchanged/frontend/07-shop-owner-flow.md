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
