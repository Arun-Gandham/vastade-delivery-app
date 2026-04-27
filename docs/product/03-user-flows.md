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
6. Nearby approved online captains receive a real-time task offer.
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
4. Nearby approved online captains receive offers.
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

## Real-time task assignment flow

1. System creates a `delivery_task` when an order or parcel becomes dispatchable.
2. Backend finds nearby captains who are:
   - approved
   - online
   - not busy
   - within configured radius
3. Backend ranks captains by pickup distance.
4. Backend creates `captain_task_offers`.
5. Realtime layer emits:
   - `delivery_task_created`
   - `captain:task_offer_received`
6. Captain app shows:
   - task type
   - pickup and drop
   - captain-to-pickup distance
   - pickup-to-drop distance
   - estimated earning
   - estimated time
   - accept and reject actions
7. First valid acceptance wins inside a DB transaction.
8. Backend assigns `captainId`, marks task `accepted`, marks captain `busy`, and expires competing offers.
9. Backend emits:
   - `delivery_task_assigned`
   - `captain:task_accepted`
   - `delivery_status_updated`
   - `order_out_for_delivery` when applicable

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

## Security flow notes

1. Captain legal documents are private.
2. Only admins and the owning captain can access submitted legal documents.
3. Shop and customer never receive Aadhaar, PAN, RC, or license proof images.
4. Shop and customer only receive limited delivery-contact fields after assignment.
