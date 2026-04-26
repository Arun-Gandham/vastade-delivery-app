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
