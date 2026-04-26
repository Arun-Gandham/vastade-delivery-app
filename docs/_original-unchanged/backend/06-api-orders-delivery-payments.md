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
