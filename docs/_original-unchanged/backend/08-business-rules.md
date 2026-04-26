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
