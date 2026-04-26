# Business Rules and Statuses

This file is the shared source of truth for statuses, enums, cart rules, order rules, inventory rules, COD rules, pagination, sorting, search, and soft delete.

---

## Enums

# Enums

# 8. Enums

## OrderStatus

```txt
PLACED
CONFIRMED
PACKING
READY_FOR_PICKUP
ASSIGNED_TO_CAPTAIN
OUT_FOR_DELIVERY
DELIVERED
CANCELLED
FAILED
REFUNDED
```

## PaymentMode

```txt
COD
UPI_MANUAL
RAZORPAY
```

## PaymentStatus

```txt
PENDING
PAID
FAILED
REFUNDED
COD_PENDING
COD_COLLECTED
```

## DeliveryAssignmentStatus

```txt
ASSIGNED
ACCEPTED
REJECTED
PICKED_UP
DELIVERED
CANCELLED
```

---


---

## Business Rules

# Business Rules

# 10. Business Rules

## Cart Rules

```txt
One active cart per customer per shop
Cart cannot contain products from multiple shops
Product price must be copied into cart_items when added
Cart must validate latest price and stock during checkout
```

## Order Placement Rules

```txt
Order must be created inside DB transaction
Inventory must be reserved inside same transaction
Cart must be cleared after successful order
Order number must be unique
Order status history must be created
Notification event must be queued after transaction success
```

## Inventory Rules

During order placement:

```txt
availableStock -= quantity
reservedStock += quantity
```

During cancellation:

```txt
reservedStock -= quantity
availableStock += quantity
```

During delivery:

```txt
reservedStock -= quantity
soldStock += quantity
```

Never allow stock values below zero.

## Order Status Flow

```txt
PLACED
  -> CONFIRMED
  -> PACKING
  -> READY_FOR_PICKUP
  -> ASSIGNED_TO_CAPTAIN
  -> OUT_FOR_DELIVERY
  -> DELIVERED
```

Cancellation allowed from:

```txt
PLACED
CONFIRMED
PACKING
READY_FOR_PICKUP
```

Cancellation not allowed after:

```txt
OUT_FOR_DELIVERY
DELIVERED
```

## COD Rules

```txt
If paymentMode = COD, paymentStatus = COD_PENDING
When captain delivers, paymentStatus = COD_COLLECTED
Captain cashInHand increases by COD amount
```

---


---

## Transactions, Pagination, Sorting, Search, Soft Delete, Testing, Swagger, and Deliverables

# Transactions, Pagination, Testing, Swagger, Deliverables

# 21. Critical Transaction APIs

These APIs must use DB transactions:

```txt
POST /orders
POST /orders/:orderId/cancel
POST /shop-owner/orders/:orderId/cancel
POST /captains/orders/:orderId/delivered
POST /shop-owner/shops/:shopId/inventory/:productId/adjust
POST /admin/orders/:orderId/assign-captain
```

---

---

# 22. Order Number Format

```txt
QC-YYYYMMDD-000001
```

Example:

```txt
QC-20260425-000001
```

---

---

# 23. Pagination Standard

Request:

```txt
?page=1&limit=20
```

Response meta:

```json
{
  "page": 1,
  "limit": 20,
  "total": 100,
  "totalPages": 5
}
```

---

---

# 24. Sorting Standard

```txt
?sortBy=createdAt&sortOrder=desc
```

Allowed sortOrder:

```txt
asc
desc
```

---

---

# 25. Search Standard

```txt
?search=milk
```

Search in:

```txt
Product name
Brand
SKU
Order number
Customer mobile
Shop name
```

---

---

# 26. Soft Delete Standard

Do not hard delete important data.

Use:

```txt
isActive = false
```

For:

```txt
users
shops
categories
products
captains
```

---

---

# 27. Testing Requirements

Unit tests:

```txt
Auth service
Order service
Inventory service
Payment service
Coupon service
```

Integration tests:

```txt
Customer registration
Login
Add to cart
Place order
Confirm order
Assign captain
Deliver order
Cancel order
```

---

---

# 28. Swagger / OpenAPI Requirement

Backend must expose:

```http
GET /api-docs
```

Swagger should include:

```txt
All endpoints
Request DTOs
Response DTOs
Auth token support
Role access notes
Error responses
Try it out support for testing APIs from browser
Bearer token authorization button in Swagger UI
```

Swagger UI usage:

```txt
Open http://localhost:5000/api-docs
Use the Authorize button to paste Bearer <access_token>
Run protected APIs directly from Swagger using Try it out
Use request bodies, query params, path params, and multipart upload from the UI
```

---

---

# 29. Final Backend Deliverables

```txt
Complete Node.js TypeScript backend
Prisma schema
MySQL migrations
JWT auth
Refresh token flow
Role-based middleware
All APIs listed above
Order transaction logic
Inventory transaction logic
Captain delivery flow
COD payment flow
Notification queue structure
Swagger documentation
Dockerfile
docker-compose.yml
.env.example
README with setup commands
```

---

---

# 30. Local Development Commands

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

---

---

# 31. Production Commands

```bash
npm run build
npm run start
```

Docker:

```bash
docker compose up -d --build
```

---

---

# 32. Final Priority

For the first village pilot, backend priority should be:

```txt
No missed orders
Correct inventory
Simple order flow
Fast shop owner confirmation
Reliable captain delivery update
COD/UPI handling
Clean admin dashboard APIs
```

After ground testing works, add:

```txt
Live map tracking
Auto captain assignment
Online payment gateway
Offer engine
Customer wallet
AI product recommendation
Multi-village expansion
```

