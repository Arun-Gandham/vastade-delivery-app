# Overview

## Purpose

This document defines the frontend specification for a quick-commerce grocery delivery MVP.

The frontend must support:

```txt
Customer web/mobile experience
Captain / delivery partner experience
Shop owner / store manager panel
Admin panel
Super admin panel
```

The application should look modern, smooth, mobile-first, and product-ready.

The UI can be inspired by modern grocery and food delivery apps, but it must use original design, original components, and configurable brand colors.

## Product goal

Build a clean and usable MVP where:

```txt
Customers can browse shops and products
Customers can add products to cart
Customers can place orders
Customers can track order status
Shop owners can manage inventory and orders
Captains can accept, pick up, and deliver orders
Admins can manage shops, products, orders, captains, and reports
Super admins can access everything
```

## Frontend type

Use a single Next.js application with role-based dashboards.

Recommended:

```txt
One codebase
Role-based route protection
Responsive layouts
Mobile-first customer and captain screens
Desktop-friendly admin and shop owner panels
```

## Primary users

```txt
CUSTOMER
CAPTAIN
SHOP_OWNER
STORE_MANAGER
ADMIN
SUPER_ADMIN
```

## Backend dependency

Frontend must use the backend APIs from:

```txt
docs/backend/
```

The backend base URL must come from environment variables.

## MVP priority

For MVP, focus on:

```txt
Simple login
Correct role redirection
Customer product ordering flow
Correct cart behavior
Correct order placement
Shop owner order confirmation
Captain delivery update
Admin visibility
Clean dashboard UI
Good mobile experience
Clean customer storefront with custom header, footer, location prompt, and nearby-shop aware home page
Direct-to-S3 uploads with object-key storage and resolved image URLs
Shared full-width customer shell reused across all customer pages
Public landing page that surfaces live categories and products through a storefront-style header, search, and footer
Shared enterprise dashboard chrome across admin, shop-owner, captain, and super-admin role surfaces
Typography, spacing, and component sizing aligned to the newer public-page design language
```

Do not build future features like wallet, AI recommendation, complex settlement, live map tracking, or auto captain assignment unless the docs are updated.
