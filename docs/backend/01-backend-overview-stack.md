# Overview

## Purpose

This document is a **backend-only API development specification** for building a quick-commerce grocery delivery platform similar to Zepto / Instamart, but targeted for a **small village or local-area pilot**.

The backend should support direct integration with:

* Customer mobile app
* Customer web app
* Captain / delivery partner mobile app
* Admin web panel
* Shop owner / store manager web or mobile panel

This document is written so that a developer or Codex-style coding agent can generate the full backend end-to-end.

---

---

# 1. Recommended Backend Stack

```txt
Runtime: Node.js
Language: TypeScript
Framework: Express.js or NestJS
Database: MySQL
ORM: Prisma
Cache: Redis
Queue: BullMQ
Authentication: JWT + Refresh Token
Validation: Zod / class-validator
File Storage: S3 with presigned upload and read URLs
Logging: Pino / Winston
API Docs: Swagger / OpenAPI
Deployment: Docker + Nginx
```

Recommended for rapid production-level development:

```txt
Node.js + TypeScript + Express + Prisma + MySQL + Redis
```

---

---

# 2. User Roles

```txt
SUPER_ADMIN
ADMIN
SHOP_OWNER
STORE_MANAGER
CUSTOMER
CAPTAIN
```

| Role          | Description                                |
| ------------- | ------------------------------------------ |
| SUPER_ADMIN   | Platform owner, full access                |
| ADMIN         | Internal operations team                   |
| SHOP_OWNER    | Owns one or multiple shops/stores          |
| STORE_MANAGER | Manages orders and inventory for one store |
| CUSTOMER      | Places grocery orders                      |
| CAPTAIN       | Delivery partner                           |

---

---

# 3. Main Modules

```txt
Auth Module
User Module
Customer Module
Address Module
Shop / Store Module
Category Module
Product Module
Inventory Module
Cart Module
Order Module
Payment Module
Captain / Delivery Module
Coupon Module
Notification Module
Upload Module
Admin Dashboard Module
Shop Owner Dashboard Module
Audit Log Module
```

---

---

# 4. API Base URL

```txt
Local: http://localhost:5000/api/v1
Production: https://api.yourdomain.com/api/v1
```

---

---

# 5. Standard API Response Format

## Success Response

```json
{
  "success": true,
  "message": "Success message",
  "data": {},
  "meta": {}
}
```

## Error Response

```json
{
  "success": false,
  "message": "Error message",
  "errorCode": "ERROR_CODE",
  "errors": []
}
```

---

---

# 6. Authentication Rules

```txt
Access Token: 15 minutes
Refresh Token: 7 to 30 days
Auth Header: Authorization: Bearer <access_token>
```

For fast MVP:

```txt
Mobile + Password login
```

Later:

```txt
Mobile OTP
WhatsApp OTP
Google login
```

Password rules:

```txt
Minimum 8 characters
At least 1 uppercase letter
At least 1 lowercase letter
At least 1 number
At least 1 special character
```

---
