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

Public landing page expectations:

```txt
/ should use a storefront-style header instead of the old minimal marketing navbar
/ should show browser-derived delivery context in the header when location permission is available
/ should expose storefront search that routes into customer product browsing
/ should render live category tiles and live product sections from frontend API hooks
/ should include a storefront footer with links and category shortcuts
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

Super admin can use the same admin routes with full permissions.

Optional separate routes:

```txt
/super-admin
/super-admin/dashboard
/super-admin/admins
/super-admin/settings
/super-admin/audit-logs
```

## Required page behavior

Login page must support all roles and redirect by role. Customer pages must support product browsing, cart, checkout, orders, addresses, profile, and notifications. Shop owner pages must support shops, dashboard, inventory, orders, reports, and open/close status. Captain pages must support online status, location, assigned orders, pickup, delivery, and COD collection. Admin pages must support dashboard, shops, categories, products, orders, captains, coupons, reports, and settings.

Customer storefront expectations:

```txt
/customer pages use one shared full-width storefront header and footer
/customer should attempt location-based address capture when no saved delivery context exists
/customer should recover from stale selected shop state by falling back to the first valid nearby shop
/customer home should show categories, nearby shops, product sections, and recent orders
```
