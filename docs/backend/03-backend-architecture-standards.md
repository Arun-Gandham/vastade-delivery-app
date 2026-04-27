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
| Assign Captain   |       No |            No |                 No | System / Admin review only | System / Admin review only |
| Deliver Order    |       No | Assigned only |                 No |    No |          No |
| Reports          |       No |            No |           Own shop |   All |         All |
| Verify Captains  |       No |            No |                 No |   Yes |         Yes |
| Track Delivery   | Own orders only | Assigned only | Own orders only |   All |         All |

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
Captain self-registration
Admin captain verification
Generic delivery task lifecycle
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
Live map tracking polish
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
14. Delivery task and task-offer APIs
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

## New captain and delivery module standards

```txt
captains module owns self-registration, profile, documents, verification state, and admin captain review APIs
delivery-tasks module owns generic logistics tasks, task offers, task acceptance, task progression, and parcel-linked delivery orchestration
orders module should create grocery delivery tasks but should not own generic captain matching rules
shop modules may expose tracking for their own orders but must not create or approve captains
```

## Realtime assignment architecture plan

```txt
1. admin or shop accepts an order, or parcel flow marks a parcel dispatchable
2. backend creates delivery_task with pickup and drop coordinates
3. matching service loads nearby captains from latest captain_locations
4. filter captains by approved + online + not busy + within configured radius
5. rank by captain-to-pickup distance
6. create captain_task_offers for all eligible nearby captains within the configured radius
7. emit order:available-for-captains over Socket.IO to eligible captain rooms or captains:online
8. each captain dashboard shows the same nearby request independently and in real time
9. first accept call enters transaction and locks the delivery_task row
10. backend writes winner captainId and task status accepted, then sets order status CAPTAIN_ASSIGNED
11. competing offers are expired or cancelled
12. losing captain rooms receive immediate order:remove-from-available event
13. customer, shop, and admin rooms receive order:assigned, order:ready-for-pickup, order:picked-up, and order:delivered events
```

## Socket room model

```txt
captain:{captainId}
captains:online
user:{customerId}
shop:{shopId}
admin
admin:{adminId}
delivery-task:{taskId}
order:{orderId}
```

Room responsibilities:

```txt
captain room receives offers, offer expiry, task removal, active task updates, and earnings updates
delivery-task room receives status changes and live captain location
customer and shop rooms receive only post-assignment tracking-safe payloads
admin room receives all operational events for monitoring
```

## Captain dashboard contract plan

```txt
captain dashboard should be built as a task inbox plus active task workspace
pending nearby offers are separate from accepted active task
new ready-for-pickup or ready-for-delivery tasks should appear live without captain refresh
offer cards should include pickup/drop summaries, map preview, ETA, earning, and countdown
accepted task view should include pickup map, drop map, live navigation intent, and status action buttons
if another captain accepts first, the offer must disappear in real time without a refresh
```

---
