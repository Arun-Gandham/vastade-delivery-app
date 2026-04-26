# Database Entities

# 7. Database Entities

## users

```txt
id UUID PK
name VARCHAR(150)
mobile VARCHAR(20) UNIQUE
email VARCHAR(150) UNIQUE NULL
passwordHash TEXT NULL
role ENUM
profileImage TEXT NULL
isMobileVerified BOOLEAN DEFAULT false
isEmailVerified BOOLEAN DEFAULT false
isActive BOOLEAN DEFAULT true
lastLoginAt TIMESTAMP NULL
createdAt TIMESTAMP
updatedAt TIMESTAMP
```

## user_sessions

```txt
id UUID PK
userId UUID FK users.id
refreshToken TEXT
deviceId TEXT NULL
deviceType VARCHAR(50) NULL
fcmToken TEXT NULL
ipAddress TEXT NULL
userAgent TEXT NULL
expiresAt TIMESTAMP
revokedAt TIMESTAMP NULL
createdAt TIMESTAMP
```

## customer_addresses

```txt
id UUID PK
customerId UUID FK users.id
fullName VARCHAR(150)
mobile VARCHAR(20)
houseNo TEXT
street TEXT
landmark TEXT
village VARCHAR(150)
mandal VARCHAR(150) NULL
district VARCHAR(150) NULL
state VARCHAR(150) NULL
pincode VARCHAR(10)
latitude DECIMAL(10,7) NULL
longitude DECIMAL(10,7) NULL
addressType ENUM HOME, WORK, OTHER
isDefault BOOLEAN DEFAULT false
createdAt TIMESTAMP
updatedAt TIMESTAMP
```

## shops

```txt
id UUID PK
ownerId UUID FK users.id
name VARCHAR(200)
mobile VARCHAR(20)
email VARCHAR(150) NULL
licenseNumber VARCHAR(100) NULL
gstNumber VARCHAR(100) NULL
address TEXT
village VARCHAR(150)
pincode VARCHAR(10)
latitude DECIMAL(10,7) NULL
longitude DECIMAL(10,7) NULL
openingTime TIME NULL
closingTime TIME NULL
isOpen BOOLEAN DEFAULT true
isActive BOOLEAN DEFAULT true
createdAt TIMESTAMP
updatedAt TIMESTAMP
```

## shop_staff

```txt
id UUID PK
shopId UUID FK shops.id
userId UUID FK users.id
role ENUM SHOP_OWNER, STORE_MANAGER
isActive BOOLEAN DEFAULT true
createdAt TIMESTAMP
updatedAt TIMESTAMP
```

## categories

```txt
id UUID PK
name VARCHAR(150)
slug VARCHAR(150) UNIQUE
imageUrl TEXT NULL
parentId UUID NULL FK categories.id
sortOrder INT DEFAULT 0
isActive BOOLEAN DEFAULT true
createdAt TIMESTAMP
updatedAt TIMESTAMP
```

## products

```txt
id UUID PK
categoryId UUID FK categories.id
name VARCHAR(200)
slug VARCHAR(200) UNIQUE
description TEXT NULL
brand VARCHAR(150) NULL
unit VARCHAR(50)
unitValue DECIMAL(10,2) NULL
mrp DECIMAL(10,2)
sellingPrice DECIMAL(10,2)
barcode VARCHAR(100) NULL
imageUrl TEXT NULL
isActive BOOLEAN DEFAULT true
createdAt TIMESTAMP
updatedAt TIMESTAMP
```

## product_images

```txt
id UUID PK
productId UUID FK products.id
imageUrl TEXT
sortOrder INT DEFAULT 0
createdAt TIMESTAMP
```

## shop_inventory

```txt
id UUID PK
shopId UUID FK shops.id
productId UUID FK products.id
availableStock INT DEFAULT 0
reservedStock INT DEFAULT 0
soldStock INT DEFAULT 0
damagedStock INT DEFAULT 0
lowStockAlert INT DEFAULT 5
isAvailable BOOLEAN DEFAULT true
createdAt TIMESTAMP
updatedAt TIMESTAMP
UNIQUE(shopId, productId)
```

## carts

```txt
id UUID PK
customerId UUID FK users.id
shopId UUID FK shops.id
createdAt TIMESTAMP
updatedAt TIMESTAMP
```

## cart_items

```txt
id UUID PK
cartId UUID FK carts.id
productId UUID FK products.id
quantity INT
unitPrice DECIMAL(10,2)
totalPrice DECIMAL(10,2)
createdAt TIMESTAMP
updatedAt TIMESTAMP
UNIQUE(cartId, productId)
```

## orders

```txt
id UUID PK
orderNumber VARCHAR(50) UNIQUE
customerId UUID FK users.id
shopId UUID FK shops.id
addressId UUID FK customer_addresses.id
captainId UUID FK users.id NULL
status ENUM
paymentMode ENUM
paymentStatus ENUM
subtotal DECIMAL(10,2)
deliveryFee DECIMAL(10,2)
platformFee DECIMAL(10,2) DEFAULT 0
discount DECIMAL(10,2) DEFAULT 0
totalAmount DECIMAL(10,2)
codAmount DECIMAL(10,2) DEFAULT 0
customerNotes TEXT NULL
cancelReason TEXT NULL
placedAt TIMESTAMP
confirmedAt TIMESTAMP NULL
packedAt TIMESTAMP NULL
pickedUpAt TIMESTAMP NULL
deliveredAt TIMESTAMP NULL
cancelledAt TIMESTAMP NULL
createdAt TIMESTAMP
updatedAt TIMESTAMP
```

## order_items

```txt
id UUID PK
orderId UUID FK orders.id
productId UUID FK products.id
productName VARCHAR(200)
productImage TEXT NULL
quantity INT
unitPrice DECIMAL(10,2)
totalPrice DECIMAL(10,2)
createdAt TIMESTAMP
```

## order_status_history

```txt
id UUID PK
orderId UUID FK orders.id
oldStatus VARCHAR(50) NULL
newStatus VARCHAR(50)
changedBy UUID FK users.id NULL
remarks TEXT NULL
createdAt TIMESTAMP
```

## payments

```txt
id UUID PK
orderId UUID FK orders.id
paymentMode ENUM COD, UPI_MANUAL, RAZORPAY
paymentStatus ENUM PENDING, PAID, FAILED, REFUNDED, COD_PENDING, COD_COLLECTED
provider VARCHAR(100) NULL
providerOrderId TEXT NULL
providerPaymentId TEXT NULL
providerSignature TEXT NULL
amount DECIMAL(10,2)
paidAt TIMESTAMP NULL
createdAt TIMESTAMP
updatedAt TIMESTAMP
```

## captains

```txt
id UUID PK
userId UUID FK users.id
vehicleType ENUM BIKE, CYCLE, AUTO, WALKING
vehicleNumber VARCHAR(50) NULL
licenseNumber VARCHAR(100) NULL
isOnline BOOLEAN DEFAULT false
isAvailable BOOLEAN DEFAULT true
currentLatitude DECIMAL(10,7) NULL
currentLongitude DECIMAL(10,7) NULL
cashInHand DECIMAL(10,2) DEFAULT 0
createdAt TIMESTAMP
updatedAt TIMESTAMP
```

## delivery_assignments

```txt
id UUID PK
orderId UUID FK orders.id
captainId UUID FK users.id
assignedBy UUID FK users.id NULL
status ENUM ASSIGNED, ACCEPTED, REJECTED, PICKED_UP, DELIVERED, CANCELLED
assignedAt TIMESTAMP
acceptedAt TIMESTAMP NULL
pickedUpAt TIMESTAMP NULL
deliveredAt TIMESTAMP NULL
createdAt TIMESTAMP
updatedAt TIMESTAMP
```

## stock_movements

```txt
id UUID PK
shopId UUID FK shops.id
productId UUID FK products.id
movementType ENUM
quantity INT
beforeStock INT
afterStock INT
referenceType VARCHAR(50) NULL
referenceId UUID NULL
remarks TEXT NULL
createdBy UUID FK users.id NULL
createdAt TIMESTAMP
```

Movement types:

```txt
STOCK_ADDED
STOCK_RESERVED
STOCK_RELEASED
STOCK_SOLD
STOCK_DAMAGED
STOCK_ADJUSTED
```

## coupons

```txt
id UUID PK
code VARCHAR(50) UNIQUE
description TEXT NULL
discountType ENUM PERCENTAGE, FLAT
value DECIMAL(10,2)
minOrderAmount DECIMAL(10,2) DEFAULT 0
maxDiscount DECIMAL(10,2) NULL
usageLimit INT NULL
usedCount INT DEFAULT 0
validFrom TIMESTAMP
validTo TIMESTAMP
isActive BOOLEAN DEFAULT true
createdAt TIMESTAMP
updatedAt TIMESTAMP
```

## notifications

```txt
id UUID PK
userId UUID FK users.id
channel ENUM PUSH, SMS, WHATSAPP, EMAIL, IN_APP
title VARCHAR(200)
message TEXT
payload JSONB NULL
isRead BOOLEAN DEFAULT false
sentAt TIMESTAMP NULL
createdAt TIMESTAMP
```

## audit_logs

```txt
id UUID PK
userId UUID FK users.id NULL
action VARCHAR(150)
entityName VARCHAR(150)
entityId UUID NULL
oldValue JSONB NULL
newValue JSONB NULL
ipAddress TEXT NULL
userAgent TEXT NULL
createdAt TIMESTAMP
```

---
