# User Flows

This file describes the current and intended product flows after the captain refactor. Captains self-register, admins verify them, and delivery execution runs through generic `delivery_tasks`.

## Route map

Public and auth:

```txt
/
/about
/contact
/terms
/privacy
/support
/login
/register
/forgot-password
/reset-password
/unauthorized
```

Customer:

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

Captain in the current unified frontend:

```txt
/captain
/captain/login
/captain/orders
/captain/orders/[orderId]
/captain/profile
/captain/earnings
/captain/notifications
```

Recommended future split:

```txt
/captain-web or mobile captain app
```

Admin:

```txt
/admin/dashboard
/admin/orders
/admin/orders/[orderId]
/admin/captains
/admin/shops
/admin/categories
/admin/products
/admin/inventory
/admin/customers
/admin/coupons
/admin/reports/*
/admin/notifications
/admin/settings
```

Super admin:

```txt
/super-admin/dashboard
/super-admin/admins
/super-admin/audit-logs
/super-admin/settings
/super-admin/shops
/super-admin/categories
/super-admin/products
/super-admin/orders
/super-admin/customers
/super-admin/captains
/super-admin/coupons
/super-admin/reports/*
/super-admin/notifications
```

## Role redirects

```txt
CUSTOMER      -> /customer
CAPTAIN       -> /captain
SHOP_OWNER    -> /shop-owner
STORE_MANAGER -> /shop-owner
ADMIN         -> /admin/dashboard
SUPER_ADMIN   -> /super-admin/dashboard
```

## Customer grocery flow

1. Customer browses categories, nearby shops, and products.
2. Customer adds items to cart and places an order.
3. Shop accepts and prepares the order.
4. Shop marks the order ready for pickup.
5. Backend creates a generic `delivery_task` with `taskType = grocery`.
6. All approved online nearby captains within the configured radius receive the same real-time task offer over sockets.
7. First valid captain acceptance assigns the task.
8. Captain reaches pickup, picks up, reaches drop, and delivers.
9. Order status and delivery task status stay synchronized.
10. Customer sees live delivery status and captain details after assignment.

## Parcel flow

1. Customer creates a parcel request.
2. Backend stores a `parcel_order`.
3. Backend creates a linked `delivery_task` with:
   - `taskType = parcel`
   - `referenceTable = parcel_orders`
   - `referenceId = parcel_order.id`
4. All approved online nearby captains within the configured radius receive the same real-time parcel offer over sockets.
5. Captain accepts, picks up, and delivers the parcel.
6. Customer tracks the parcel through the delivery-task lifecycle.

## Captain self-registration flow

1. Captain opens public registration or future captain app onboarding.
2. Captain submits:
   - name, mobile, email, password or OTP-auth identity
   - profile photo
   - DOB and address
   - emergency contact
   - vehicle details and RC
   - license details and images
   - ID proof details and images
   - bank and UPI details
   - agreement and terms acceptance
3. System creates:
   - auth user with role `CAPTAIN`
   - `captains`
   - `captain_documents`
   - `captain_vehicles`
   - `captain_bank_details`
   - initial `captain_verification_logs`
4. Registration status starts as `submitted` or `pending_verification`.
5. Captain can log in and view submission state, but cannot go online or accept tasks until approved.

## Admin captain verification flow

1. Admin opens captain applications.
2. Admin reviews identity, license, RC, and bank details.
3. Admin checks legal-document images through private or signed access.
4. Admin approves, rejects with reason, blocks, or unblocks the captain.
5. Every action creates a `captain_verification_log`.
6. Only approved captains can go online and receive task offers.

## Real-time captain assignment flow

1. Customer places the order and the order starts in `PENDING`.
2. Admin or shop accepts the order and the order moves to `ACCEPTED`.
3. System creates or reuses the linked `delivery_task`.
4. Backend finds nearby captains who are:
   - approved
   - online
   - not busy
   - within configured radius
5. Backend ranks captains by pickup distance.
6. Backend creates one `captain_task_offer` per eligible nearby captain.
7. Socket.IO or the realtime socket layer emits:
   - `order:available-for-captains`
8. Captain app shows:
   - task type
   - pickup and drop
   - captain-to-pickup distance
   - pickup-to-drop distance
   - estimated earning
   - estimated time
   - accept action
   - pickup map marker
   - drop map marker
   - route preview or straight-line fallback
9. Every eligible nearby captain within the configured radius should see the same offer at the same time in the dashboard inbox.
10. First valid acceptance wins inside a DB transaction using an atomic `captainId IS NULL` update.
11. Backend assigns the winning captain, moves the order to `CAPTAIN_ASSIGNED`, marks captain `busy`, and expires competing offers.
12. The winning captain keeps the order in the active-delivery list.
13. The same order is removed in real time from every other captain dashboard or captain app through `order:remove-from-available`.
14. If another captain tries to accept after the winner commits, the API returns `409 Order already accepted by another captain.`
15. Backend emits:
   - `order:assigned`
   - `order:ready-for-pickup`
   - `order:picked-up`
   - `order:delivered`

## Captain dashboard nearby-request flow

1. Captain opens the dashboard while online.
2. Client sends `captain:connect` and the latest captain location.
3. Dashboard loads:
   - current availability status
   - active accepted task if any
   - pending nearby task offers
   - recent completed or failed tasks
4. When a new nearby delivery task is offered, the dashboard should surface:
   - a high-priority request card
   - pickup location summary
   - drop location summary
   - map preview with pickup and drop markers
   - captain-to-pickup distance
   - pickup-to-drop distance
   - estimated earning
   - accept and reject buttons
   - visible offer countdown
5. If another captain accepts the task first, the card should disappear immediately and may show a short `Task no longer available` state.
6. If the current captain accepts first, the task moves from the offer inbox to the active task workspace.

## Live map and tracking flow

1. Each delivery task stores pickup latitude/longitude and drop latitude/longitude.
2. Captain client sends periodic live location updates while online and while on an active task.
3. Backend stores current captain location and may append history points for analytics or replay.
4. After assignment, the following surfaces can receive live location and task status:
   - captain dashboard
   - customer tracking page
   - shop delivery tracking view
   - admin delivery monitoring view
5. Before assignment, no customer or shop map should show captain identity or captain location.
6. After assignment or after pickup, tracking policy may expose:
   - captain live marker
   - pickup marker
   - drop marker
   - current task status
   - ETA
7. Captain legal documents are never part of tracking payloads.

## Captain task lifecycle

1. Captain goes online.
2. Captain sends periodic location updates.
3. Captain receives one or more offers.
4. Captain accepts one task.
5. Captain updates task state:
   - reached pickup
   - picked up
   - reached drop
   - delivered
   - failed if necessary
6. Backend notifies customer, shop, admin, and captain channels.
7. On successful delivery:
   - delivery task becomes `delivered`
   - order or parcel is finalized
   - captain earning record is created
   - captain becomes available again

## Shop flow for delivery

Shop users do not create or approve captains.

Shop responsibilities:

1. Accept and prepare grocery orders.
2. Mark orders ready for pickup.
3. View assigned delivery task for their order.
4. View captain summary after assignment.
5. Track live captain location for their own order when exposed by policy.

## Customer tracking flow

1. Customer opens order details.
2. After captain assignment, customer sees:
   - delivery status
   - captain name
   - captain phone if allowed
   - vehicle type
   - masked vehicle number if needed
3. Customer can track location after assignment or pickup depending on policy.
4. Customer receives status updates for:
   - task assigned
   - out for delivery
   - delivered

## Real-time consistency rules

1. The same delivery request should be broadcast to all eligible nearby captains in parallel through sockets.
2. Only one captain may win acceptance.
3. Acceptance must use row locking or equivalent transaction protection.
4. Once accepted, all competing offers must be marked `expired` or `cancelled`.
5. Other captains must receive an immediate removal or expiry event so stale task cards do not remain visible.
6. If the assigned captain fails or the task is cancelled, the system may reopen the task and rerun nearby matching from the pickup point.

## Security flow notes

1. Captain legal documents are private.
2. Only admins and the owning captain can access submitted legal documents.
3. Shop and customer never receive Aadhaar, PAN, RC, or license proof images.
4. Shop and customer only receive limited delivery-contact fields after assignment.
