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
Use request bodies, query params, path params, and the upload-signing JSON contract from the UI
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
