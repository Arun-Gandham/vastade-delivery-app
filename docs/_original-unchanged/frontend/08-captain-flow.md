# Captain App Flow

## Captain journey

```txt
Login
Go online
Receive assigned order
Accept or reject order
Go to shop pickup
Mark picked up
Go to customer address
Collect COD if applicable
Mark delivered
Upload delivery proof if available
Go offline
```

## Routes

```txt
/captain
/captain/orders
/captain/orders/[orderId]
/captain/profile
/captain/earnings
/captain/notifications
```

## Dashboard

Show online/offline toggle, availability, assigned orders, active delivery, today delivered count, and cash in hand.

## Online and location APIs

```http
PATCH /captains/me/online-status
PATCH /captains/me/location
```

Ask location permission, handle denied permission, and allow retry.

## Captain order APIs

```http
GET /captains/me/orders
POST /captains/orders/:orderId/accept
POST /captains/orders/:orderId/reject
POST /captains/orders/:orderId/picked-up
POST /captains/orders/:orderId/delivered
```

## Delivered form

```txt
paymentCollected
collectedAmount
deliveryProofImage optional
```

For COD, paymentCollected and collectedAmount are required.

## Captain UI

Mobile-first, large buttons, sticky bottom action bar, pickup card, delivery card, COD alert card, and clear status badges.
