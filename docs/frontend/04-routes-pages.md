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
/captain/register
/captain
/captain/login
/captain/orders
/captain/orders/[orderId]
/captain/profile
/captain/earnings
/captain/notifications
```

Current note:

```txt
The current unified Next.js app still hosts captain screens.
The backend APIs are already designed so captain flows can move to a dedicated captain web or mobile client later.
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
/admin/shops/new
/admin/shops/[shopId]
/admin/shops/[shopId]/edit
/admin/categories
/admin/categories/new
/admin/categories/[categoryId]
/admin/categories/[categoryId]/edit
/admin/products
/admin/products/new
/admin/products/[productId]
/admin/products/[productId]/edit
/admin/inventory
/admin/orders
/admin/orders/[orderId]
/admin/coupons
/admin/coupons/new
/admin/reports/sales
/admin/reports/product-sales
/admin/reports/low-stock
/admin/notifications
/admin/settings
```

## Super admin routes

Super admin has its own mirrored management route space and should stay inside `/super-admin/*`.

```txt
/super-admin
/super-admin/dashboard
/super-admin/admins
/super-admin/shops
/super-admin/shops/new
/super-admin/shops/[shopId]
/super-admin/shops/[shopId]/edit
/super-admin/categories
/super-admin/categories/new
/super-admin/categories/[categoryId]
/super-admin/categories/[categoryId]/edit
/super-admin/products
/super-admin/products/new
/super-admin/products/[productId]
/super-admin/products/[productId]/edit
/super-admin/orders
/super-admin/orders/[orderId]
/super-admin/inventory
/super-admin/customers
/super-admin/captains
/super-admin/coupons
/super-admin/coupons/new
/super-admin/reports/sales
/super-admin/reports/product-sales
/super-admin/notifications
/super-admin/settings
/super-admin/audit-logs
```

## Required page behavior

Login page must support all roles and redirect by role. Customer pages must support product browsing, cart, checkout, orders, addresses, profile, notifications, and delivery tracking. Shop owner pages must support shops, dashboard, inventory, orders, reports, and open/close status. Captain pages must support self-registration status, online status, location updates, task offers, assigned task progression, earnings, and notifications. Admin pages must support dashboard, shops, categories, products, orders, captain verification, delivery-task oversight, coupons, reports, and settings.

Admin and super-admin management route expectations:

```txt
List pages should stay focused on lists or cards
Create forms should open on dedicated /new routes
Edit forms should open on dedicated /[id]/edit routes
Detail pages should expose compact view and edit actions
```

Customer storefront expectations:

```txt
/customer pages use one shared full-width storefront header and footer
/customer should attempt location-based address capture when no saved delivery context exists
/customer should recover from stale selected shop state by falling back to the first valid nearby shop
/customer home should show categories, nearby shops, product sections, and recent orders
```

Captain UX expectations:

```txt
Captain registration should collect identity, vehicle, license, bank, and agreement details
Captain task screens should be modeled around generic delivery tasks, not only grocery orders
Captain pages should avoid reusing customer order cards and customer order-detail assumptions
Captain offer screens should show earning estimate, pickup/drop, and accept or reject actions
```
