# APIs — Uploads, Notifications, Dashboards

# 9.16 Upload APIs

```http
POST /uploads/image
```

Form-data:

```txt
file: image
folder: products | categories | shops | delivery-proof
```

Validation:

```txt
Allowed types: jpg, jpeg, png, webp
Max size: 5 MB
```

---

---

# 9.17 Notification APIs

```http
GET /notifications
PATCH /notifications/:notificationId/read
POST /notifications/register-device
```

Register device request:

```json
{
  "fcmToken": "token",
  "deviceType": "ANDROID"
}
```

---

---

# 9.18 Admin Dashboard APIs

```http
GET /admin/dashboard/summary
GET /admin/reports/sales
GET /admin/reports/product-sales
GET /admin/reports/low-stock
```

Dashboard response:

```json
{
  "success": true,
  "data": {
    "totalOrders": 1000,
    "todayOrders": 50,
    "todayRevenue": 25000,
    "activeCustomers": 500,
    "activeShops": 5,
    "activeCaptains": 10,
    "pendingOrders": 8,
    "cancelledOrders": 3
  }
}
```

---

---

# 9.19 Shop Owner Dashboard APIs

```http
GET /shop-owner/shops/:shopId/dashboard/summary
GET /shop-owner/shops/:shopId/reports/sales
GET /shop-owner/shops/:shopId/reports/low-stock
```

Summary response:

```json
{
  "success": true,
  "data": {
    "todayOrders": 20,
    "todayRevenue": 10000,
    "pendingOrders": 5,
    "deliveredOrders": 15,
    "cancelledOrders": 1,
    "lowStockProducts": 12
  }
}
```

---
