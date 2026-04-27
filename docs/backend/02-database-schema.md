# Database Schema

This document reflects the current backend design direction after the captain and logistics refactor.

## Core principle

Captains are not created by admin or shop panels.

They register themselves and are later reviewed by admin.

Delivery execution is no longer modeled only as:

```txt
Order -> Captain
```

It is modeled as:

```txt
Grocery Order
Parcel Order
Future Food / Medicine / Custom Jobs
        -> Delivery Task -> Captain
```

## Main entities

## users

```txt
id UUID PK
name VARCHAR(150)
mobile VARCHAR(20) UNIQUE
email VARCHAR(150) UNIQUE NULL
passwordHash TEXT NULL
role ENUM SUPER_ADMIN, ADMIN, SHOP_OWNER, STORE_MANAGER, CUSTOMER, CAPTAIN
profileImage TEXT NULL
isMobileVerified BOOLEAN
isEmailVerified BOOLEAN
isActive BOOLEAN
lastLoginAt TIMESTAMP NULL
createdAt TIMESTAMP
updatedAt TIMESTAMP
```

## captains

```txt
id UUID PK
userId UUID FK users.id UNIQUE
profilePhoto TEXT NULL
dateOfBirth TIMESTAMP NULL
fullAddress TEXT NULL
city VARCHAR(150) NULL
state VARCHAR(150) NULL
pincode VARCHAR(10) NULL
emergencyContactName VARCHAR(150) NULL
emergencyContactPhone VARCHAR(20) NULL
vehicleType ENUM BIKE, SCOOTER, CYCLE, CAR, AUTO, WALKING
vehicleNumber VARCHAR(50) NULL
licenseNumber VARCHAR(100) NULL
idProofNumber VARCHAR(100) NULL
agreementAccepted BOOLEAN
termsAccepted BOOLEAN
registrationStatus ENUM SUBMITTED, PENDING_VERIFICATION, APPROVED, REJECTED, BLOCKED
availabilityStatus ENUM OFFLINE, ONLINE, BUSY
verifiedAt TIMESTAMP NULL
approvalNotes TEXT NULL
rejectionReason TEXT NULL
blockedAt TIMESTAMP NULL
blockedReason TEXT NULL
isOnline BOOLEAN
isAvailable BOOLEAN
currentLatitude DECIMAL(10,7) NULL
currentLongitude DECIMAL(10,7) NULL
cashInHand DECIMAL(10,2)
rating DECIMAL(4,2) NULL
totalDeliveries INT
createdAt TIMESTAMP
updatedAt TIMESTAMP
```

## captain_documents

```txt
id UUID PK
captainId UUID FK captains.id
documentType ENUM PROFILE_PHOTO, VEHICLE_RC, DRIVING_LICENSE_FRONT, DRIVING_LICENSE_BACK, ID_PROOF_FRONT, ID_PROOF_BACK, AGREEMENT, OTHER
documentNumber VARCHAR(100) NULL
fileKey TEXT
fileUrl TEXT NULL
isVerified BOOLEAN
verifiedAt TIMESTAMP NULL
rejectionReason TEXT NULL
createdAt TIMESTAMP
updatedAt TIMESTAMP
```

## captain_vehicles

```txt
id UUID PK
captainId UUID FK captains.id
vehicleType ENUM BIKE, SCOOTER, CYCLE, CAR, AUTO, WALKING
vehicleNumber VARCHAR(50)
rcDocumentKey TEXT NULL
isPrimary BOOLEAN
createdAt TIMESTAMP
updatedAt TIMESTAMP
```

## captain_bank_details

```txt
id UUID PK
captainId UUID FK captains.id
accountHolderName VARCHAR(150)
accountNumber VARCHAR(50)
ifscCode VARCHAR(20)
upiId VARCHAR(100) NULL
isPrimary BOOLEAN
createdAt TIMESTAMP
updatedAt TIMESTAMP
```

## captain_verification_logs

```txt
id UUID PK
captainId UUID FK captains.id
action ENUM SUBMITTED, PENDING_VERIFICATION, APPROVED, REJECTED, BLOCKED
remarks TEXT NULL
performedByUserId UUID NULL
createdAt TIMESTAMP
```

## delivery_tasks

Generic logistics table used for grocery, parcel, and future delivery products.

```txt
id UUID PK
taskType ENUM GROCERY, PARCEL, FOOD, MEDICINE, CUSTOM
referenceId UUID / string
referenceTable VARCHAR(100)
shopId UUID NULL
customerId UUID NULL
captainId UUID FK captains.id NULL
status ENUM CREATED, SEARCHING_CAPTAIN, OFFERED_TO_CAPTAINS, ACCEPTED, CAPTAIN_REACHED_PICKUP, PICKED_UP, CAPTAIN_REACHED_DROP, DELIVERED, CANCELLED, FAILED
pickupName VARCHAR(150) NULL
pickupPhone VARCHAR(20) NULL
pickupAddress TEXT
pickupLatitude DECIMAL(10,7) NULL
pickupLongitude DECIMAL(10,7) NULL
dropName VARCHAR(150) NULL
dropPhone VARCHAR(20) NULL
dropAddress TEXT
dropLatitude DECIMAL(10,7) NULL
dropLongitude DECIMAL(10,7) NULL
deliveryFee DECIMAL(10,2)
distanceKm DECIMAL(10,2) NULL
estimatedPickupAt TIMESTAMP NULL
estimatedDeliveryAt TIMESTAMP NULL
assignedAt TIMESTAMP NULL
pickedUpAt TIMESTAMP NULL
deliveredAt TIMESTAMP NULL
cancelledAt TIMESTAMP NULL
failureReason TEXT NULL
createdAt TIMESTAMP
updatedAt TIMESTAMP
```

Recommended indexes and constraints:

```txt
INDEX(taskType, status)
INDEX(referenceTable, referenceId)
INDEX(captainId, status)
INDEX(pickupLatitude, pickupLongitude)
INDEX(dropLatitude, dropLongitude)
```

Operational notes:

```txt
pickup and drop coordinates are required for captain matching and map tracking
captainId stays NULL until a winning acceptance transaction succeeds
status should move through created -> searching_captain -> offered_to_captains -> accepted -> picked_up -> delivered or failed
```

## captain_task_offers

```txt
id UUID PK
deliveryTaskId UUID FK delivery_tasks.id
captainId UUID FK captains.id
status ENUM SENT, ACCEPTED, REJECTED, EXPIRED, CANCELLED
distanceToPickupKm DECIMAL(10,2) NULL
pickupToDropKm DECIMAL(10,2) NULL
estimatedEarning DECIMAL(10,2) NULL
offeredAt TIMESTAMP
respondedAt TIMESTAMP NULL
expiresAt TIMESTAMP NULL
rejectionReason TEXT NULL
createdAt TIMESTAMP
updatedAt TIMESTAMP
UNIQUE(deliveryTaskId, captainId)
```

Recommended indexes:

```txt
INDEX(captainId, status, expiresAt)
INDEX(deliveryTaskId, status)
```

Operational notes:

```txt
multiple captains may receive parallel offers for the same delivery task
only one offer may end in accepted status
all other open offers should become expired or cancelled when one captain wins
offer rows support captain dashboard inbox visibility
```

## captain_locations

```txt
id UUID PK
captainId UUID FK captains.id
latitude DECIMAL(10,7)
longitude DECIMAL(10,7)
heading DECIMAL(10,2) NULL
speed DECIMAL(10,2) NULL
createdAt TIMESTAMP
```

Recommended indexes:

```txt
INDEX(captainId, createdAt)
INDEX(latitude, longitude)
```

Operational notes:

```txt
latest location powers nearby captain matching and live delivery tracking
historical points support route replay, support debugging, and future analytics
```

## captain_earnings

```txt
id UUID PK
captainId UUID FK captains.id
deliveryTaskId UUID FK delivery_tasks.id
amount DECIMAL(10,2)
status VARCHAR(50)
settledAt TIMESTAMP NULL
createdAt TIMESTAMP
```

## captain_notifications

```txt
id UUID PK
captainId UUID FK captains.id
title VARCHAR(200)
message TEXT
payload JSON NULL
isRead BOOLEAN
createdAt TIMESTAMP
```

## parcel_orders

```txt
id UUID PK
customerId UUID FK users.id
senderName VARCHAR(150)
senderPhone VARCHAR(20)
pickupAddress TEXT
pickupLatitude DECIMAL(10,7) NULL
pickupLongitude DECIMAL(10,7) NULL
receiverName VARCHAR(150)
receiverPhone VARCHAR(20)
dropAddress TEXT
dropLatitude DECIMAL(10,7) NULL
dropLongitude DECIMAL(10,7) NULL
packageDetails TEXT NULL
status VARCHAR(50)
deliveryFee DECIMAL(10,2)
createdAt TIMESTAMP
updatedAt TIMESTAMP
```

## Legacy grocery entities still used

These remain active and continue to power the grocery MVP:

```txt
shops
categories
products
shop_inventory
carts
cart_items
orders
order_items
order_status_history
payments
notifications
audit_logs
```

## Relationship summary

```txt
User 1 -> 1 Captain
Captain 1 -> many CaptainDocuments
Captain 1 -> many CaptainVehicles
Captain 1 -> many CaptainBankDetails
Captain 1 -> many CaptainVerificationLogs
Captain 1 -> many CaptainLocations
Captain 1 -> many CaptainTaskOffers
Captain 1 -> many CaptainEarnings
Captain 1 -> many CaptainNotifications
DeliveryTask 1 -> many CaptainTaskOffers
DeliveryTask 1 -> many CaptainEarnings
ParcelOrder 1 -> 1 DeliveryTask via referenceId/referenceTable
Order 1 -> 1 DeliveryTask via referenceId/referenceTable
```
