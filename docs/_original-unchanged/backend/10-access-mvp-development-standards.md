# Access, MVP Scope, Development Standards

# 17. API Access Matrix

| Module           | Customer |       Captain |         Shop Owner | Admin | Super Admin |
| ---------------- | -------: | ------------: | -----------------: | ----: | ----------: |
| Auth             |      Yes |           Yes |                Yes |   Yes |         Yes |
| Products Public  |      Yes |           Yes |                Yes |   Yes |         Yes |
| Cart             |      Yes |            No |                 No |    No |          No |
| Place Order      |      Yes |            No |                 No |    No |          No |
| View Own Orders  |      Yes | Assigned only |   Shop orders only |   All |         All |
| Manage Products  |       No |            No | Limited if allowed |   Yes |         Yes |
| Manage Inventory |       No |            No |           Own shop |   Yes |         Yes |
| Assign Captain   |       No |            No |    Own shop orders |   Yes |         Yes |
| Deliver Order    |       No | Assigned only |                 No |    No |          No |
| Reports          |       No |            No |           Own shop |   All |         All |

---

---

# 18. Minimum MVP Scope

For first village pilot, build only this first:

```txt
Auth
Customer profile
Address
Shop
Category
Product
Inventory
Cart
Order
Shop order management
Manual captain assignment
Captain delivery flow
COD payment
Basic admin dashboard
```

Do not build initially:

```txt
Wallet
Subscription
Advanced offers
AI recommendation
Multiple payment gateways
Live map tracking
Auto captain assignment
Complex settlement
```

---

---

# 19. Development Order

```txt
1. Project setup
2. Prisma schema
3. Auth module
4. Role middleware
5. User/profile module
6. Shop module
7. Category module
8. Product module
9. Inventory module
10. Cart module
11. Order placement with transaction
12. Shop order status APIs
13. Captain module
14. Delivery assignment APIs
15. Payment module basic COD
16. Notification queue
17. Dashboard APIs
18. Swagger docs
19. Tests
20. Docker deployment
```

---

---

# 20. Required Backend Implementation Standards

Each module should have:

```txt
module.routes.ts
module.controller.ts
module.service.ts
module.repository.ts
module.validation.ts
module.types.ts
```

Example:

```txt
orders/
  order.routes.ts
  order.controller.ts
  order.service.ts
  order.repository.ts
  order.validation.ts
  order.types.ts
```

Controller responsibility:

```txt
Read request
Call validation middleware
Call service
Return response
No business logic
```

Service responsibility:

```txt
Business logic
Transactions
Status rules
Calling repositories
Calling queues
```

Repository responsibility:

```txt
Database access only
No business rules
```

---
