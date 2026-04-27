# Business Rules and Statuses

This file is the shared rules reference for orders, captains, delivery tasks, payments, search, pagination, and operational security.

## Core enums

Order status:

```txt
PENDING
ACCEPTED
CAPTAIN_ASSIGNED
READY_FOR_PICKUP
PICKED_UP
DELIVERED
CANCELLED
REJECTED
```

Payment mode:

```txt
COD
UPI_MANUAL
RAZORPAY
```

Payment status:

```txt
PENDING
PAID
FAILED
REFUNDED
COD_PENDING
COD_COLLECTED
```

Captain registration status:

```txt
SUBMITTED
PENDING_VERIFICATION
APPROVED
REJECTED
BLOCKED
```

Captain availability status:

```txt
OFFLINE
ONLINE
BUSY
```

Delivery task type:

```txt
GROCERY
PARCEL
FOOD
MEDICINE
CUSTOM
```

Delivery task status:

```txt
CREATED
SEARCHING_CAPTAIN
OFFERED_TO_CAPTAINS
ACCEPTED
CAPTAIN_REACHED_PICKUP
PICKED_UP
CAPTAIN_REACHED_DROP
DELIVERED
CANCELLED
FAILED
```

Captain task-offer status:

```txt
SENT
ACCEPTED
REJECTED
EXPIRED
CANCELLED
```

## Order rules

Order placement:

```txt
Order creation must run in a DB transaction
Inventory reservation must happen in the same transaction
Cart clears only after successful order creation
Order number must remain unique
Order-status history should be recorded
```

Order status progression:

```txt
PENDING
-> ACCEPTED
-> CAPTAIN_ASSIGNED
-> READY_FOR_PICKUP
-> PICKED_UP
-> DELIVERED
```

Cancellation allowed from:

```txt
PENDING
ACCEPTED
CAPTAIN_ASSIGNED
READY_FOR_PICKUP
```

Cancellation blocked after:

```txt
PICKED_UP
DELIVERED
```

## Inventory rules

On order placement:

```txt
availableStock -= quantity
reservedStock += quantity
```

On cancellation:

```txt
reservedStock -= quantity
availableStock += quantity
```

On completed delivery:

```txt
reservedStock -= quantity
soldStock += quantity
```

Never allow negative stock values.

## COD rules

```txt
If paymentMode = COD, paymentStatus = COD_PENDING
When captain delivers, paymentStatus = COD_COLLECTED
Captain cash-in-hand or settlement balance should be updated by settlement logic
```

## Captain registration and verification rules

```txt
Captains must self-register
Admin only can approve, reject, block, or unblock captains
Shop users cannot create, edit, or approve captains
Captain must accept agreement and terms during registration
Captain legal-document objects must stay private
Only approved captains may go online or accept tasks
Blocked captains cannot go online or receive offers
```

## Delivery-task rules

Generic task model:

```txt
delivery_tasks is the dispatch layer for grocery, parcel, and future logistics services
Orders and parcel orders reference delivery_tasks through referenceTable + referenceId
Captains are assigned to delivery tasks, not only directly to grocery orders
```

Task creation rules:

```txt
Grocery task is created when admin or shop accepts the order
Parcel task is created when a parcel order is submitted and accepted by business rules
captainId is nullable until assignment succeeds
pickup/drop coordinates should be stored when available
```

Task-assignment rules:

```txt
Captain must be APPROVED
Captain must be ONLINE
Captain must not be BUSY
Captain must be within configured matching radius
Accepted grocery orders become visible to every eligible captain at the same time
First valid acceptance wins
Competing offers must expire or cancel
Acceptance must use transaction and lock semantics
Atomic update must fail with `Order already accepted by another captain.` when another captain wins first
```

Captain task-status update rules:

```txt
Only the assigned captain can update an assigned task
Task status must move forward through valid transitions
Reached-pickup comes before picked-up
Reached-drop comes before delivered
Delivered or failed should release captain availability from BUSY
```

## Privacy and data-exposure rules

Admin can see:

```txt
Captain profile
Legal documents
Verification history
Delivery history
Earnings
```

Captain can see:

```txt
Own profile
Own submitted documents
Own tasks
Own earnings
```

Shop and customer can see only after assignment:

```txt
Captain name
Captain phone if policy allows
Vehicle type
Masked vehicle number if needed
Rating if available
Live location for active delivery if policy allows
```

Shop and customer must never see:

```txt
Driving-license proofs
Aadhaar or PAN proofs
RC legal document files
Bank details
Internal verification logs
```

## Critical transaction APIs

These APIs must be transaction-safe:

```txt
POST /orders
POST /orders/:orderId/cancel
POST /shop-owner/orders/:orderId/cancel
POST /captain/tasks/:taskId/accept
POST /captain/tasks/:taskId/delivered
POST /captain/tasks/:taskId/failed
POST /parcels
POST /shop-owner/shops/:shopId/inventory/:productId/adjust
```

## Real-time event baseline

Captain-side events:

```txt
captain:connect
captain:go_online
captain:go_offline
captain:location_update
captain:task_offer_received
captain:task_offer_expired
captain:task_accepted
captain:task_cancelled
captain:task_status_updated
captain:earnings_updated
```

Shared platform events:

```txt
delivery_task_created
delivery_task_assigned
captain_location_updated
delivery_status_updated
order_out_for_delivery
order_delivered
```

## Pagination, sorting, and search

Pagination request:

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

Sorting:

```txt
?sortBy=createdAt&sortOrder=desc
```

Search examples:

```txt
?search=milk
?search=QC-20260425-000001
?search=9876543210
```

Suggested searchable fields:

```txt
Product name
Brand
SKU
Order number
Customer mobile
Shop name
Captain mobile
Parcel tracking or reference number
```
