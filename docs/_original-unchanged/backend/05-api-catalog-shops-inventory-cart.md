# APIs — Catalog, Shops, Inventory, Cart

# 9.4 Category APIs

## Public

```http
GET /categories
```

## Admin

```http
POST /admin/categories
PATCH /admin/categories/:categoryId
DELETE /admin/categories/:categoryId
```

Create request:

```json
{
  "name": "Vegetables",
  "imageUrl": "url",
  "parentId": null,
  "sortOrder": 1
}
```

---

---

# 9.5 Product APIs

## Public Product List

```http
GET /products?shopId=uuid&categoryId=uuid&search=milk&page=1&limit=20
```

Response item:

```json
{
  "id": "uuid",
  "name": "Milk",
  "categoryId": "uuid",
  "brand": "Brand Name",
  "unit": "500 ml",
  "mrp": 35,
  "sellingPrice": 32,
  "imageUrl": "url",
  "availableStock": 10,
  "isAvailable": true
}
```

## Product Details

```http
GET /products/:productId?shopId=uuid
```

## Admin Product Management

```http
POST /admin/products
PATCH /admin/products/:productId
DELETE /admin/products/:productId
```

Create request:

```json
{
  "categoryId": "uuid",
  "name": "Milk",
  "description": "Fresh milk",
  "brand": "Brand Name",
  "unit": "ml",
  "unitValue": 500,
  "mrp": 35,
  "sellingPrice": 32,
  "barcode": "1234567890",
  "imageUrl": "url"
}
```

---

---

# 9.6 Shop APIs

## Public

```http
GET /shops/nearby?village=VillageName&pincode=533001
GET /shops/:shopId
```

## Admin

```http
POST /admin/shops
PATCH /admin/shops/:shopId
```

Create request:

```json
{
  "ownerId": "uuid",
  "name": "Sai Grocery Store",
  "mobile": "9876543210",
  "email": "shop@example.com",
  "address": "Main Road",
  "village": "Village Name",
  "pincode": "533001",
  "latitude": 16.1234567,
  "longitude": 82.1234567,
  "openingTime": "07:00",
  "closingTime": "22:00"
}
```

## Shop Owner Open Status

```http
PATCH /shop-owner/shops/:shopId/open-status
```

Request:

```json
{
  "isOpen": true
}
```

---

---

# 9.7 Inventory APIs

```http
PUT /shop-owner/shops/:shopId/inventory/:productId
POST /shop-owner/shops/:shopId/inventory/bulk
GET /shop-owner/shops/:shopId/inventory
POST /shop-owner/shops/:shopId/inventory/:productId/adjust
```

Update request:

```json
{
  "availableStock": 100,
  "lowStockAlert": 10,
  "isAvailable": true
}
```

Adjust request:

```json
{
  "quantity": 10,
  "adjustmentType": "ADD",
  "remarks": "New stock received"
}
```

Allowed adjustment types:

```txt
ADD
REMOVE
SET
DAMAGED
```

---

---

# 9.8 Cart APIs

```http
GET /cart?shopId=uuid
POST /cart/items
PATCH /cart/items/:cartItemId
DELETE /cart/items/:cartItemId
DELETE /cart?shopId=uuid
```

Add item request:

```json
{
  "shopId": "uuid",
  "productId": "uuid",
  "quantity": 2
}
```

Rules:

```txt
Check product is active
Check shop inventory exists
Check availableStock >= requested quantity
If item already exists, increase quantity
Cart should belong to one shop only
```

---

---
